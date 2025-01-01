import { Response } from "express";

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: TMeta;
    data: T;
  };
  

export const sendResponse = <T>(res: Response, response: TResponse<T>) => {
  const { statusCode, success, message, meta, data } = response;
  res.status(statusCode).json({
    success,
    message,
    meta,
    data,
  });
};