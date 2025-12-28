/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokrnWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;
//   const isUserExits = await User.findOne({ email });

//   if (!isUserExits) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email not exits ");
//   }

//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExits.password as string
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Password Is incorrect");
//   }

//   const userTokens = createUserToken(isUserExits);

//   const { password: pass, ...rest } = isUserExits.toObject();
//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToen = await createNewAccessTokrnWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToen,
  };
};

const resetPassword = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.userId) {
    throw new AppError(401, "You can not reset your password");
  }

  const isUserExist = await User.findById(decodedToken.userId);
  if (!isUserExist) {
    throw new AppError(401, "User does not exist");
  }

  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  isUserExist.password = hashedPassword;

  await isUserExist.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set you password. Now you can change the password from your profile password update"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;

  user.auths = auths;

  await user.save();
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user?.save();
};

const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });

  /**
   * http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
   */
};

export const AuthServices = {
  //credentialsLogin,
  getNewAccessToken,
  resetPassword,
  setPassword,
  changePassword,
  forgotPassword,
};
