import { Response } from "express";

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    data: T;
  };
  

export const sendResponse = <T>(res: Response, response: TResponse<T>) => {
  const { statusCode, success, message, data } = response;
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};