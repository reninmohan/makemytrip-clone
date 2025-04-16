import { NextFunction, Request, Response } from "express";
import { createUser as createUserFn } from "../services/index.js";
import { HttpError } from "../utils/error.utils.js";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUserFn(req.body);
    console.log("User created successfully", { userId: user.id });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(409, "Unable to create user", error));
  }
};
