//Use this middleware if you already have jwt token in ur header only
import { NextFunction, Request, Response } from "express";
import { verifyToken, IVerifyToken, verifyAdminToken } from "../services/auth.services.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";

export type RequestWithUser = Request & { user?: IVerifyToken };

export const authUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);
    (req as RequestWithUser).user = user;
    return next();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(401, "Unexpected Error: User do not have authorizatoin", error));
  }
};

export const authAdmin = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user = await verifyAdminToken(req);
    (req as RequestWithUser).user = user;
    return next();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(401, "Unexcepted Error: Failed to authorize as admin. "));
  }
};
