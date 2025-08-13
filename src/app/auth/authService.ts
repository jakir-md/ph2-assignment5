/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelper/AppError";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import { IUser } from "../modules/user/user.interface";
import {
  getAccessTokenWithRefreshToken,
  getUserToken,
} from "../utils/userTokens";

const loginUser = async (payload: Partial<IUser>) => {
  const { phone, password } = payload;
  const isUserExists = await User.findOne({ phone });
  if (!isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found");
  }

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExists.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password Not Matched.");
  }

  const { accessToken, refreshToken } = getUserToken(isUserExists);
  const { password: pass, ...rest } = isUserExists.toObject();
  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

const getAccessToken = async (refreshToken: string) => {
  const token = await getAccessTokenWithRefreshToken(refreshToken);
  return { accessToken: token };
};
export const AuthServices = {
  loginUser,
  getAccessToken
};
