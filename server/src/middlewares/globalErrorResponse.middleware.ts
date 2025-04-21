/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

interface IAppError extends Error {
  statusCode?: number;
  errorObj?: any;
}
export const globalErrorResponse = (error: IAppError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error.statusCode || 500;

  const mainMessage = error.message || "Internal server Error";

  let data = undefined;

  if (error?.errorObj?.issues) {
    console.log("\nValidation Error", error?.errorObj?.issues);
    data = error?.errorObj?.issues;
  } else if (error?.errorObj?.errorResponse) {
    data = error?.errorObj?.errorResponse;
  } else {
    data = error;
  }

  res.status(statusCode).json(new ApiResponse(false, mainMessage, data));
};

//Perfect
