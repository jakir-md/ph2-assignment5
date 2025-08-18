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
      data: result.rest,
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User Created Successfully.",
      meta: {
        total: result.total,
      },
    });
  }
);

const updateUserInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const decodedToken = req.user;
    const payload = req.body;
    const result = await UserServices.updateUserInfo(
      payload,
      decodedToken,
      userId
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Updated Successfully.",
    });
  }
);

const verifyWithKYC = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const userId = req.params.id;
    const result = await UserServices.verifyWithKYC(
      decodedToken,
      userId,
      req.body
    );
    sendResponse(res, {
      data: null,
      success: true,
      statusCode: StatusCodes.OK,
      message: `${
        result === true
          ? "User is verified successfully"
          : "KYC Updated. But User not verified"
      } .`,
    });
  }
);

const getUsersAndWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getUsersAndWallet();
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Users with wallet info retrieved successfully.",
    });
  }
);

export const UserControllers = {
  registerUser,
  updateUserInfo,
  getUsersAndWallet,
  verifyWithKYC,
};
