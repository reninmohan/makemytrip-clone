import { NextFunction, Request, Response } from "express";
import * as userServices from "../services/user.services.js";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userServices.createUser(req.body);
    console.log("User created successfully", { userId: user.id });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating user: ", error.message);
    }
    return next(error);
  }
};
