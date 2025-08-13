import { AuthRoutes } from "../auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import express from "express";
const router = express.Router();

const appRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
];

appRoutes.forEach((item) => router.use(item.path, item.route));
