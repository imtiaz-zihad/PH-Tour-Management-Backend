
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createUserToken } from "../../utils/userToken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExits = await User.findOne({ email });

  if (!isUserExits) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email not exits ");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExits.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password Is incorrect");
  }

  const userTokens = createUserToken(isUserExits);

  const { password: pass, ...rest } = isUserExits.toObject();
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
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


  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};
