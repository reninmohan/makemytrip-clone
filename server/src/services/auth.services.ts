import jwt from "jsonwebtoken";
import ENV from "../config/env.config.js";
import { IUserDocument, User } from "../db/models/user.model.js";
import { UserLogin } from "../schemas/user.schema.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { comparePassword } from "../utils/password.utils.js";
import { IUserResponse } from "../types/user.types.js";
import { Request } from "express";
import { generateTokens } from "../utils/generateToken.utils.js";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = ENV;

interface ICreateToken extends IUserResponse {
  accessToken: string;
  refreshToken: string;
}

const createTokenResponse = (user: IUserDocument, accessToken: string, refreshToken: string): ICreateToken => {
  return {
    id: user.id.toString(),
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    // createdAt: user.createdAt,
    // updatedAt: user.updatedAt,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

//For create a token
export const createToken = async (loginData: UserLogin) => {
  const user = await User.findOne({
    email: loginData.email,
  });

  if (!user) {
    throw new HttpError(401, "Email id not registered.");
  }
  const isPasswordValid = await comparePassword(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid email or password");
  }
  const { accessToken, refreshToken } = generateTokens({ id: user.id, role: user.role, email: user.email });
  return createTokenResponse(user, accessToken, refreshToken);
};

//For verify already existing token in headers

export interface IVerifyToken {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
}

const verifyTokenResponse = (user: IUserDocument): IVerifyToken => {
  return {
    id: user.id.toString(),
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user.role,
  };
};

export const verifyToken = async (request: Request): Promise<IVerifyToken> => {
  const authHeaders = request.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new HttpError(401, "Authorization Header missing in request headers");
  }

  const token = authHeaders.split(" ")[1];
  if (!token) {
    throw new HttpError(401, "Authorization token missing in request headers");
  }

  if (!ACCESS_TOKEN_SECRET) {
    throw new HttpError(401, "Access Token secret missing in Env");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string };
  } catch (error) {
    throw new HttpError(401, "Invalid or expired token", error);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new HttpError(401, "User not found");
  }

  return verifyTokenResponse(user);
};

// Add refresh token function
export const refreshToken = async (req: Request): Promise<ICreateToken> => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new HttpError(401, "No refresh token received, kindly relogin");
  }

  if (!REFRESH_TOKEN_SECRET || !ACCESS_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRY || !REFRESH_TOKEN_EXPIRY) {
    throw new HttpError(401, "Access token, Refresh token, Access Expiry or Refresh Expiry must be missing in env");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string };
  } catch (error) {
    throw new HttpError(401, "Invalid or expired refresh token", error);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new HttpError(401, "User not found");
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens({ id: user.id, role: user.role, email: user.email });

  return createTokenResponse(user, newAccessToken, newRefreshToken);
};

export const verifyAdminToken = async (req: Request): Promise<IVerifyToken> => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new HttpError(401, "Authorization Header missing in request headers");
  }

  const token = authHeaders.split(" ")[1];
  if (!token) {
    throw new HttpError(401, "Authorization token missing in request headers");
  }

  if (!ACCESS_TOKEN_SECRET) {
    throw new HttpError(401, "Access Token secret missing in Env");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string; role: string };
  } catch (error) {
    throw new HttpError(401, "Invalid or expired token", error);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new HttpError(401, "User not found");
  }

  if (user.role !== "admin") {
    throw new HttpError(401, "Access denied. Admin access required.");
  }

  return verifyTokenResponse(user);
};
