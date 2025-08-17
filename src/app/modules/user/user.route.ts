import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, updateUserZodSchema, verifyWithKYCZodSchema } from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
const router = express.Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.registerUser
);

router.patch(
  "/verify-with-kyc/:id",
  validateRequest(verifyWithKYCZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.verifyWithKYC
);

router.patch(
  "/:userId",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUserInfo
);

//admin routes
//get specific user
router.get(
  "/all-users-with-wallet",
  checkAuth(Role.ADMIN),
  UserControllers.getUsersAndWallet
);


export const UserRoutes = router;
