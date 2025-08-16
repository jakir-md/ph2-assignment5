/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { WalletServices } from "./wallet.service";

const getBalance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.user;
    const result = await WalletServices.getBalance(phone);
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Balance Amount Retrieved Successfully.",
    });
  }
);

const addMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.user;
    const { amount } = req.body;
    const result = await WalletServices.addMoney(phone, amount);
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Add Money successfull.",
    });
  }
);

const sendMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.user;
    const { amount, receiverPhone } = req.body;
    const result = await WalletServices.sendMoney(phone, receiverPhone, amount);
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Send Money successfull.",
    });
  }
);

const cashOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.user;
    const { agentPhone, amount } = req.body;
    const result = await WalletServices.cashOut(phone, amount, agentPhone);
    sendResponse(res, {
      data: {
        transactionId: result,
      },
      success: true,
      statusCode: StatusCodes.OK,
      message: "CashOut successfull.",
    });
  }
);

export const WalletControllers = {
  getBalance,
  addMoney,
  cashOut,
  sendMoney
};
