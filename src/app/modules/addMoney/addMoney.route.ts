import express from "express";
import { AddMoneyControllers } from "./addMoney.controller";
const router = express.Router();

router.post("/success", AddMoneyControllers.successAddMoney);
router.post("/fail", AddMoneyControllers.failedAddMoney);

export const AddMoneyRoutes = router;
