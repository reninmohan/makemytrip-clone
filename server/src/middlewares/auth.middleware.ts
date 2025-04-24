//Use this middleware if you already have jwt token in ur header only
import ENV from "../config/env.config.js";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { IUserResponse } from "../types/user.types.js";
import { User, IUserDocument } from "../db/models/user.model.js";

const { ACCESS_TOKEN_SECRET } = ENV;

export type DecodedToken = { id: string; role: string; email: string };

export type RequestWithUser = Request & { user?: IUserResponse };

export interface RequestWithUserAndBody<T> extends Request {
  user?: IUserResponse;
  body: T & {
    images?: string[];
    logo?: string;
  };
}

export const authUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user = await verifyUserToken(req);
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

// Auth Middleware services

const verifyTokenResponse = (user: IUserDocument): IUserResponse => {
  return {
    id: user.id.toString(),
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user.role,
  };
};

const extractTokenFromHeader = (headers: Request["headers"]): string => {
  const authHeaders = headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new HttpError(401, "Authorization Header missing in request headers");
  }
  const token = authHeaders.split(" ")[1];
  if (!token) {
    throw new HttpError(401, "Authorization token missing in request headers");
  }
  return token;
};

const verifyJwtToken = async (token: string): Promise<DecodedToken> => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new HttpError(500, "Access Token secret missing in Env");
  }
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as DecodedToken;
  } catch (error) {
    throw new HttpError(401, "Invalid or expired token", error);
  }
};

export const verifyUserToken = async (req: Request): Promise<IUserResponse> => {
  const token = extractTokenFromHeader(req.headers);
  const decoded = await verifyJwtToken(token);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new HttpError(401, "User not found in db.");
  }

  return verifyTokenResponse(user);
};

export const verifyAdminToken = async (req: Request): Promise<IUserResponse> => {
  const token = extractTokenFromHeader(req.headers);
  const decoded = await verifyJwtToken(token);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new HttpError(401, "User not found");
  }

  if (user.role !== "admin") {
    throw new HttpError(401, "Access denied. Admin access required.");
  }

  return verifyTokenResponse(user);
};
