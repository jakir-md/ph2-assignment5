import express from "express";
import { TransactionControllers } from "./transaction.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
const router = express.Router();

router.post(
  "/user-history",
  checkAuth(Role.USER),
  TransactionControllers.viewUserHistory
);

router.post(
  "/comission-history",
  checkAuth(Role.AGENT),
  TransactionControllers.viewAgentHistory
);

router.get(
  "/transaction-history",
  checkAuth(Role.ADMIN),
  TransactionControllers.allTransactions
);
export const TransactionRoutes = router;