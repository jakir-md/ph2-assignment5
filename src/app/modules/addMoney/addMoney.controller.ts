import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AddMoneyServices } from "./addMoney.service";
import { EnvVars } from "../../config/env";

const successAddMoney = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await AddMoneyServices.successAddMoney(query);

  if (result.success) {
    res.redirect(
      `${EnvVars.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`
    );
  }
});

const failedAddMoney = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await AddMoneyServices.failedAddMoney(query);

  if (!result.success) {
    res.redirect(
      `${EnvVars.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`
    );
  }
});

export const AddMoneyControllers = {
  successAddMoney,
  failedAddMoney,
};
