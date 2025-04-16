//Use this middleware if you already have jwt token in ur header only
import { NextFunction, Request, Response } from "express";
import { verifyToken, VerifyTokenI } from "../services/auth.services.js";
import { HttpError } from "../utils/error.utils.js";

type RequestWithUser = Request & { user?: VerifyTokenI };

export const authorization = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);
    (req as RequestWithUser).user = user;
    next();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(401, "User do not have authorizatoin", error));
  }
};
