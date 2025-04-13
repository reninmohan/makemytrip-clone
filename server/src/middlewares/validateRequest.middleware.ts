import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { HttpError } from "../utils/error.utils.js";

//Generic validator which will recieve schema as input and check if req.body pass or fail as per schema
export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(new HttpError(400, "Validation Error", error));
    }
  };
};
