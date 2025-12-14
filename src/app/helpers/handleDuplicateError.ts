import { TGenericErrorResponse } from "../interfaces/error.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
  const matchArray = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 400,
    message: `${matchArray[1]} already exists. Please use another one.`,
  };
};
