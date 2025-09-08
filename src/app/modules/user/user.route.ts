import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createUserZodSchema,
  updateUserZodSchema,
  verifyWithKYCZodSchema,
} from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";
const router = express.Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.registerUser
);

router.patch(
  "/verify-with-kyc/:id",
  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  validateRequest(verifyWithKYCZodSchema),
  UserControllers.verifyWithKYC
);

router.patch(
  "/:userId",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUserInfo
);

router.get(
  "/all-users-with-wallet",
  checkAuth(Role.ADMIN),
  UserControllers.getUsersAndWallet
);

router.get("/all-user", UserControllers.getAllUsers);

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

export const UserRoutes = router;
