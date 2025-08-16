import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { SystemParameterControllers } from "./systemParameter.controller";
import { addSystemParameterValidationZodSchema } from "./systemParameter.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
const router = express.Router();

router.post(
  "/add-new-parameter",
  validateRequest(addSystemParameterValidationZodSchema),
  checkAuth(Role.ADMIN),
  SystemParameterControllers.addSystemParameter
);

export const SystemRoutes = router;
