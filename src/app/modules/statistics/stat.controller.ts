import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { StatisticsServices } from "./stat.service";

const adminAnalyticsStat = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentQuater } = req.query;
    const result = await StatisticsServices.adminAnalyticsStat(
      2025,
      currentQuater as string
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admin Analytics Retrieved Successfully.",
      meta: {
        total: 10,
      },
    });
  }
);

const transactionStat = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatisticsServices.transactionStat(req.query);
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admin Analytics Retrieved Successfully.",
      meta: {
        total: 10,
      },
    });
  }
);

export const StatisticsControllers = { adminAnalyticsStat, transactionStat };
