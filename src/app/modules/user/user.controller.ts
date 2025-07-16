import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({
      name,
      email,
    });

    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Internal Server Error" });
  }
};

export const UserController = {
  createUser,
};
