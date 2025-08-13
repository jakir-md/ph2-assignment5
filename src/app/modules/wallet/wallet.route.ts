import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { WalletControllers } from "./wallet.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { addMoneyZodSchema, cashOutZodSchema } from "./wallet.validation";
const router = express.Router();

router.get(
  "/check-balance",
  checkAuth(Role.USER, Role.AGENT),
  WalletControllers.getBalance
);

router.post(
  "/add-money",
  validateRequest(addMoneyZodSchema),
  checkAuth(Role.USER, Role.AGENT),
  WalletControllers.addMoney
);

router.post(
  "/cash-out",
  validateRequest(cashOutZodSchema),
  checkAuth(Role.USER),
  WalletControllers.cashOut
);

export const WalletRoutes = router;
