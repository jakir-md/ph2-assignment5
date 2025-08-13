/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.registerUser(req.body);
    sendResponse(res, {
      data: result.user,
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User Created Successfully.",
      meta: {
        total: result.total,
      },
    });
  }
);

const verifyUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.body;
    const result = await UserServices.verifyUser(userId);
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Verified Successfully.",
    });
  }
);

const updateUserInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const decodedToken = req.user;
    const payload = req.body;
    const result = await UserServices.updateUserInfo(payload, decodedToken, userId);
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Updated Successfully.",
    });
  }
);

export const UserControllers = {
  registerUser,
  verifyUser,
  updateUserInfo
};
