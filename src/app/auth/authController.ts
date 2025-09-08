/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { catchAsync } from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./authService";
import { setAuthCookie } from "../utils/setAuthCookie";
import AppError from "../errorHelper/AppError";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.loginUser(req.body);
    setAuthCookie(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    sendResponse(res, {
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Loggged in Successfully.",
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      data: null,
      message: "User Logged Out Successfully.",
    });
  }
);

const getAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Refresh Token Not Found.");
    }
    const tokenInfo = await AuthServices.getAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      data: tokenInfo.accessToken,
      message: "Access Token Retrieved Successfully.",
      statusCode: StatusCodes.OK,
    });
  }
);

export const AuthControllers = {
  loginUser,
  logOut,
  getAccessToken,
};
