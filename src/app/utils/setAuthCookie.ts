import { Response } from "express";
import { EnvVars } from "../config/env";

export interface IAuthCookie {
  accessToken?: string;
  refreshToken?: string;
}
export const setAuthCookie = (res: Response, cookieInfo: IAuthCookie) => {
  if (cookieInfo.accessToken) {
    res.cookie("accessToken", cookieInfo.accessToken, {
      httpOnly: true,
      secure: EnvVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }

  if (cookieInfo.refreshToken) {
    res.cookie("refreshToken", cookieInfo.refreshToken, {
      httpOnly: true,
      secure: EnvVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }
};
