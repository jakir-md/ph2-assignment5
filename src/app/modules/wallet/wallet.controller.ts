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
    const decodedToken = req.user;
    const { amount } = req.body;
    const phone = req.params.phone;
    const result = await WalletServices.addMoney(decodedToken, phone, amount);
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

const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const phone = req.params.phone;
    const decodedToken = req.user;
    const { status } = req.body;
    const result = await WalletServices.updateStatus(
      decodedToken,
      phone,
      status
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Status Updated successfully.",
    });
  }
);

const addMoneyByAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const receiverPhone = req.params.phone;
    const { phone } = req.user;
    const { amount } = req.body;
    const result = await WalletServices.addMoneyByAgent(
      phone,
      receiverPhone,
      amount
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cash In successfully.",
    });
  }
);

const allWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WalletServices.allWallets();
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "All Wallets retrieved successfully.",
    });
  }
);

export const WalletControllers = {
  getBalance,
  addMoney,
  cashOut,
  sendMoney,
  updateStatus,
  addMoneyByAgent,
  allWallets,
};
