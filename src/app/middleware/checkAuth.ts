import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { EnvVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { ISActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Token Not Found.");
      }

      const decodedToken = verifyToken(
        token,
        EnvVars.JWT_ACCESS_TOKEN_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne({ phone: decodedToken.phone });

      if (!isUserExists) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found.");
      }

      if (isUserExists.isActive === (ISActive.BLOCKED || ISActive.SUSPENDED)) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `User is ${isUserExists.isActive}`
        );
      }

      if (isUserExists.isDeleted) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted..");
      }

      if (!authRoles.includes(isUserExists.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You're not authorized to view the content."
        );
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
