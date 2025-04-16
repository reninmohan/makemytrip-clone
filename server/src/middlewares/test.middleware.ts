/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, NextFunction, Response } from "express";
import { HttpError } from "../utils/error.utils.js";

export const testmidandcontroller = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    console.log("from testmiddleware :", req.user);
    res.json({ message: "Reached at testmiddleware" });
  } catch (error) {
    return next(new HttpError(1, "UnknowError "));
  }
};
