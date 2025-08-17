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
  "/add-money/:phone",
  validateRequest(addMoneyZodSchema),
  checkAuth(Role.USER, Role.AGENT),
  WalletControllers.addMoney
);

router.post(
  "/add-money-by-agent/:phone",
  checkAuth(Role.AGENT),
  WalletControllers.addMoneyByAgent
);

router.post(
  "/cash-out",
  validateRequest(cashOutZodSchema),
  checkAuth(Role.USER),
  WalletControllers.cashOut
);

router.post(
  "/send-money",
  checkAuth(Role.USER, Role.AGENT),
  WalletControllers.sendMoney
);

router.patch(
  "/update-status/:id",
  checkAuth(...Object.values(Role)),
  WalletControllers.updateStatus
);

router.get("/all-wallets", checkAuth(Role.ADMIN), WalletControllers.allWallets);
export const WalletRoutes = router;
