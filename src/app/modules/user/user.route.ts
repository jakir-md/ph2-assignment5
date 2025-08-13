import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
const router = express.Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.registerUser
);

router.get(
  "/verfify",
  checkAuth(...Object.values(Role)),
  UserControllers.verifyUser
);


router.patch(
  "/:userId",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUserInfo
);
export const UserRoutes = router;
