import express from "express";
import { TransactionControllers } from "./transaction.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
const router = express.Router();

router.get(
  "/user-history",
  checkAuth(Role.USER, Role.AGENT),
  TransactionControllers.viewUserHistory
);
router.get(
  "/transaction-history",
  checkAuth(Role.ADMIN),
  TransactionControllers.allTransactions
);

export const TransactionRoutes = router;