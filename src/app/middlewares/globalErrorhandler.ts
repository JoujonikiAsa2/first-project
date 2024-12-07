/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
export const globalErrorhandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  res.status(statusCode).json({
    success: false,
    message,
    err,
  });
  next();
};
