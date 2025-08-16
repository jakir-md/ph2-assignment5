import { AuthRoutes } from "../auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import express from "express";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { SystemRoutes } from "../modules/systemParameter/systemParameter.route";
import { TransactionRoutes } from "../modules/transaction/transaction.route";
export const router = express.Router();

const appRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/wallet",
    route: WalletRoutes
  },
  {
    path: "/systemParameter",
    route: SystemRoutes
  },
  {
    path: "/transaction",
    route: TransactionRoutes
  }
];

appRoutes.forEach((item) => router.use(item.path, item.route));
