import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokrnWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExits = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExits) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Does not exits ");
  }
  if (
    isUserExits.isActive === IsActive.BLOCKED ||
    isUserExits.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExits.isActive}`
    );
  }
  if (isUserExits.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  const JwtPayload = {
    userId: isUserExits._id,
    email: isUserExits.email,
    role: isUserExits.role,
  };

  const accessToken = generateToken(
    JwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};
