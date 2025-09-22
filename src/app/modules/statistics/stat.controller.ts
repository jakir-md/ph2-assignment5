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

const agentComissionStat = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatisticsServices.agentComissionStat();
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

const registeredUserStat = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const result = await StatisticsServices.registeredUserStat(query);
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Registered Users Data Retrieved Successfully.",
      meta: {
        total: 10,
      },
    });
  }
);

const transactionStat = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const { limit } = req.query;
    const result = await StatisticsServices.transactionStat(
      req.query as Record<string, string>
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admin transaction statistics Retrieved Successfully.",
      meta: {
        totalPage: Math.ceil(result.totalDocuments / Number(limit)),
      },
    });
  }
);
export const StatisticsControllers = {
  adminAnalyticsStat,
  transactionStat,
  agentComissionStat,
  registeredUserStat,
};
