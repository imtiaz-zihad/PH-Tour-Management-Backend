import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/user/user.model";
import { IsActive } from '../modules/user/user.interface';

export const checkAuth= (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(
          401,
          "You are not authorized to access this resource"
        );
      }

      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

      const isUserExits = await User.findOne({ email: verifiedToken.email });

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


      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          403,
          "You are not authorized to access this resource"
        );
      }

      req.user = verifiedToken

      next();
    } catch (error) {
      next(error);
    }
  }