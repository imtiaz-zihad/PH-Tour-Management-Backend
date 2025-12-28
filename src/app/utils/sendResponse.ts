/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from "express";
import { success } from "zod";


interface TMeta{
    page:number;
    limit: number;
    totalPage:number
    total: number;
}

interface TResponse<T>{
    statusCode : number;
    success: boolean;
    message: string;
    data: T;
    meta?: TMeta;
}

export  const sendResponse=<T>(res: Response,data: TResponse<T>)=>{
    res.status(data.statusCode).json({
        statusCodes: data.statusCode,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
    })
}