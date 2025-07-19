
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { date, success } from "zod";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User create Succesfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
      sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All User Retrive Succesfully",
      data: result.data,
      meta: result.meta 
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
};

// route matching --> controller --> service --> model --> DB
