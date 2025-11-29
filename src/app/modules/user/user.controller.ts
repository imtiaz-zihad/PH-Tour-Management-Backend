/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from "../../utils/jwt";

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

const updateUser = catchAsync(
 
  async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;

    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string , envVars.JWT_ACCESS_SECRET) as JwtPayload;
    
    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(userId,payload,verifiedToken );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User updated Succesfully",
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
  updateUser
};

// route matching -(app.ts,index.ts,user.route.ts)-> controller --> service --> model --> DB
