import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";


const createUser = async (req: Request, res: Response) => {
  try {
    
    const user = await UserServices.createUser(req.body);
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

// route matching --> controller --> service --> model --> DB
