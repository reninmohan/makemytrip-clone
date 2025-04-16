/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, NextFunction, Response } from "express";
import { HttpError } from "../utils/error.utils.js";
import { VerifyTokenI } from "../services/auth.services.js";

export const testmidandcontroller = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    console.log(req.user);
    res.json({ message: "Reached at end" });
  } catch (error) {
    return next(new HttpError(1, "UnknowError"));
  }
};

// & { user?: any },
