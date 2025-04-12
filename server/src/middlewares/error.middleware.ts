import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error: AppError, _req: Request, res: Response, next: NextFunction) => {
  console.log("Error from global catch middleware", error);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ status: "error", message: error?.message || "Internal server Error" });
};

export default errorHandler;
