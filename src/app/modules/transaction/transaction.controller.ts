/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { TransactionServices } from "./transaction.service";

const viewUserHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user;
    const filter = req.query;
    const result = await TransactionServices.viewUserHistory(
      userId,
      filter as Record<string, string>
    );
    sendResponse(res, {
      data: result.history,
      meta: {
        total: result.total,
        totalPage: Math.ceil(result.total / Number(filter.limit)),
      },
      success: true,
      statusCode: StatusCodes.OK,
      message: "Transaction History Retrieved Successfully.",
    });
  }
);

const viewAgentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user;
    const result = await TransactionServices.viewAgentHistory(userId);
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Transaction History Retrieved Successfully.",
    });
  }
);

const allTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionServices.allTransactions();
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Transaction History retrieved successfully.",
    });
  }
);

export const TransactionControllers = {
  viewUserHistory,
  viewAgentHistory,
  allTransactions,
};
