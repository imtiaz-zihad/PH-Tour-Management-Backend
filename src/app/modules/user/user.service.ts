import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptsjs from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExits = await User.findOne({ email });

  if (isUserExits) {
    throw new AppError(httpStatus.BAD_REQUEST, "USER_ALREADY_EXISTS");
  }

  const hasedPassword = await bcryptsjs.hash(password as string, 10);

  // const isPasswordSet = await bcryptsjs.compare(password as string, hasedPassword);

  const authProvider: IAuthProvider = {
    provider: "crediantials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hasedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = { createUser, getAllUsers };
