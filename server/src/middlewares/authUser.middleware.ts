import jwt from "jsonwebtoken";
import ENV from "../config/env.config.js";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/error.utils.js";
import { getUserById } from "../services/user.services.js";

export const authUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return next(new HttpError(401, "Authorization Header missing in request headers"));
    }

    const token = authHeaders.split(" ")[1];
    if (!token) {
      return next(new HttpError(401, "Authorization token missing in request headers"));
    }

    if (!ENV.JWT_SECRET) {
      return next(new HttpError(401, "JWT Secret Key Missing in Env"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
    } catch (error) {
      return next(new HttpError(401, "Invalid or expired token", error));
    }

    const user = await getUserById(decoded.id);
    if (!user) {
      return next(new HttpError(401, "User not found"));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
