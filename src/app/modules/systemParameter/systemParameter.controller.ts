/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SystemParameterServices } from "./systemParameter.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const addSystemParameter = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parameter = await SystemParameterServices.addSystemParameter(
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Parameter Successfully Created.",
      data: parameter,
    });
  }
);

export const SystemParameterControllers = {
  addSystemParameter,
};
