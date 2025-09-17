import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { StatisticsControllers } from "./stat.controller";
const router = express.Router();

router.get(
  "/admin-analytics",
  checkAuth(Role.ADMIN),
  StatisticsControllers.adminAnalyticsStat
);

router.get(
  "/transactionStat",
  checkAuth(Role.ADMIN),
  StatisticsControllers.transactionStat
);

router.get(
  "/agentComission",
  checkAuth(Role.AGENT),
  StatisticsControllers.agentComissionStat
);

export const StatisticsRoutes = router;
