import  httpStatus  from "http-status-codes";
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req: Request,res: Response,next: NextFunction) =>{

    const loginInfo = await  AuthServices.credentialsLogin(req.body);


    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        data: loginInfo,
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = catchAsync(async (req: Request,res: Response,next: NextFunction) =>{
    const refreshToken = req.headers.authorization ;
    const tokenInfo  = await  AuthServices.getNewAccessToken(refreshToken as string);


    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        data: tokenInfo,
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}