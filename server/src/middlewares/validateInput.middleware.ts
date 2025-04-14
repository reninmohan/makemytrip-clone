import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { HttpError } from "../utils/error.utils.js";

//Generic validator which will recieve schema as input and check if req.body pass or fail as per schema
export const validateInput = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return next(new HttpError(400, "Request body not received in post request."));
      }
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return next(new HttpError(400, "Input Validation Failed", error));
    }
  };
};
