import { JwtPayload } from "jsonwebtoken";
import { EnvVars } from "../config/env";
import { ISActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";

export const getUserToken = (payload: Partial<IUser>) => {
  const jwtPayload = {
    email: payload.email,
    role: payload.role,
    name: payload.name,
    userId: payload._id,
    phone: payload.phone,
  };

  const accessToken = generateToken(
    jwtPayload,
    EnvVars.JWT_ACCESS_TOKEN_SECRET,
    EnvVars.JWT_ACCESS_TOKEN_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    EnvVars.JWT_REFRESH_TOKEN_SECRET,
    EnvVars.JWT_REFRESH_TOKEN_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const getAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const decodedToken = verifyToken(
    refreshToken,
    EnvVars.JWT_REFRESH_TOKEN_SECRET
  ) as JwtPayload;
  const isUserExists = await User.findOne({ phone: decodedToken.phone });

  if (!isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found.");
  }

  if (isUserExists.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is Deleted.");
  }

  if (isUserExists.isActive === ISActive.INACTIVE || !isUserExists.isVerified) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "User is Inactive or Not Verified."
    );
  }

  const jwtpayload = {
    email: isUserExists.email,
    role: isUserExists.role,
    name: isUserExists.name,
    phone: isUserExists.phone,
    userId: isUserExists._id,
  };

  const token = generateToken(
    jwtpayload,
    EnvVars.JWT_ACCESS_TOKEN_SECRET,
    EnvVars.JWT_ACCESS_TOKEN_EXPIRES
  );

  return token;
};
