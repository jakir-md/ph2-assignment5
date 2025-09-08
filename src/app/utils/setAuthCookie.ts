import { Response } from "express";

export interface IAuthCookie {
  accessToken?: string;
  refreshToken?: string;
}
export const setAuthCookie = (res: Response, cookieInfo: IAuthCookie) => {
  if (cookieInfo.accessToken) {
    res.cookie("accessToken", cookieInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  if (cookieInfo.refreshToken) {
    res.cookie("refreshToken", cookieInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
};
