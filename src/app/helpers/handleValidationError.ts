import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interfaces/error.types";

export 
const handleValidationError = (err: mongoose.Error.ValidationError):TGenericErrorResponse => {
  const errorSources: TErrorSource[] = [];

  const errors = Object.values(err.errors);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};
