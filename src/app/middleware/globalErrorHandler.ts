/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSource } from "../interfaces/error.types";
import { deleteImageFromCLoudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    await deleteImageFromCLoudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );
    await Promise.all(imageUrls.map((url) => deleteImageFromCLoudinary(url)));
  }

  let errorSources: TErrorSource[] = [];
  let statusCode = 500;
  let message = "Something went wrong";

  // Duplicate Key Error
  if (err.code === 11000) {
    const simplifyHandleDuplicateError = handlerDuplicateError(err);
    statusCode = simplifyHandleDuplicateError.statusCode;
    message = simplifyHandleDuplicateError.message;
  }
  // Object Id / Cast Error
  else if (err.name === "CastError") {
    const simplifyHandleCastError = handleCastError(err);
    statusCode = simplifyHandleCastError.statusCode;
    message = simplifyHandleCastError.message;
  }
  // Zod Validation Error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSource[];
  }

  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSource[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
