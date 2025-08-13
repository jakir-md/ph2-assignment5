import { Response } from "express";

interface TMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
}

interface TResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
  meta?: TMeta;
}

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
    statusCode: data.statusCode,
  });
};
