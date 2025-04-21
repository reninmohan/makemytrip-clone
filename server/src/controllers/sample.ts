import { NextFunction, Response, Request } from "express";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";

export const sample = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(201).json(new ApiResponse(true, "", null));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: . "));
  }
};
