import { NextFunction, Response } from "express";
import { ZodSchema } from "zod";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { RequestWithUser } from "./auth.middleware.js";

//Generic validator which will recieve schema as input and check if req.body pass or fail as per schema
export const validateInput = (schema: ZodSchema) => {
  return async (req: RequestWithUser, _res: Response, next: NextFunction) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return next(new HttpError(400, "Request body not received in post request."));
      }

      const validateData = await schema.parseAsync(req.body);
      req.body = validateData;
      console.log("Validation was successful console logging  only for testing purpose..");
      console.clear();
      console.log(req.body);
      return next();
    } catch (error) {
      return next(new HttpError(400, "Input Validation Failed", error));
    }
  };
};
