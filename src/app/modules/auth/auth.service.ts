import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";


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

  const jwtPayload = {
    userId: isUserExits._id,
    email: isUserExits.email,
    role: isUserExits.role,
  };

  const accessToken =generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

  return {
    accessToken
  };
};

export const AuthServices = {
  credentialsLogin,
};
