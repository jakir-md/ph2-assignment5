/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { EnvVars } from "../config/env";
import { handleDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handleCastError";
import { handleZodError } from "../helper/handleZodError";

export const globalErrorHandler = (error: any, req: Request, res: Response) => {
  let statusCode = 500;
  let message = `Something Went Wrong. ${error.message}`;

  let errorSources: any = [];

  //duplicate error from mongodb
  if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }else if(error.name === "CastError") { //invalid mongodb objectId
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }else if(error.name === "ZodError"){
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: EnvVars.NODE_ENV === "development" ? error: null,
    stack: EnvVars.NODE_ENV === "development" ? error.stack : null
  })
};
