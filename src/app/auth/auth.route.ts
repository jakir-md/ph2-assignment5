import express from "express";
import { AuthControllers } from "./authController";
const router = express.Router();

router.post("/login", AuthControllers.loginUser);
router.post("/logout", AuthControllers.logOut);
router.post("/refresh-token", AuthControllers.getAccessToken);
export const AuthRoutes = router;