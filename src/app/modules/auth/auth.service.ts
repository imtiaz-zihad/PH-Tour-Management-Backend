/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokrnWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";

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
  const newAccessToen =await createNewAccessTokrnWithRefreshToken(refreshToken);
  return {
    accessToken: newAccessToen,
  };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};
