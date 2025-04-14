/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
  errorObj?: any;
}
export const globalErrorResponse = (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const errorResponse = {
    status: "error",
    statusCode,
    message: error?.message || "Maybe Internal server Error",
  };
  console.error("Error from global catch:");
  console.log(errorResponse);
  if (error?.errorObj?.issues) {
    console.log("Validation Error");
    console.log(error?.errorObj?.issues);
  }
  res.status(statusCode).json(errorResponse);
};
