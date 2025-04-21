import { Request, NextFunction, Response } from "express";
import { HttpError } from "../utils/ErrorResponse.utils.js";

export const testmidandcontroller = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      message: "route  successfully",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Failed to complete route", error));
  }
};
