import jwt from "jsonwebtoken";
import ENV from "../config/env.config.js";
import { IUserDocument, User } from "../db/models/user.model.js";
import { IUserLogin, IUserRegistration } from "../schemas/user.schema.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";
import { IUserResponse } from "../types/user.types.js";
import { Request } from "express";
import { generateTokens } from "../utils/generateToken.utils.js";
import { toUserResponse } from "./user.services.js";
import { MongoServerError } from "mongodb";
import { DecodedToken } from "../middlewares/auth.middleware.js";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = ENV;

export const createUserService = async (userData: IUserRegistration): Promise<IUserResponse> => {
  const existingUser = await User.findOne({ $or: [{ email: userData.email }, { phoneNumber: userData.phoneNumber }] });

  if (existingUser) {
    throw new HttpError(409, "User with same email id or phone number already exists");
  }
  //hash password before storing in db.
  const hashedPassword = await hashPassword(userData.password);

  //create new document instance.
  const user = new User({
    ...userData,
    password: hashedPassword,
  });

  try {
    await user.save();
    return toUserResponse(user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.cause instanceof MongoServerError && error?.cause?.code === 11000) {
      const errorMessage = Object.keys(error?.cause.keyValue)[0];
      throw new HttpError(401, `User ${errorMessage} should be unique`, error.cause);
    }
    throw new HttpError(500, "Unexpected Error: Failed to create user in database", error);
  }
};

export interface ICreateToken extends IUserResponse {
  accessToken: string;
  refreshToken: string;
}

// Response for create and refresh token function

export const createAndRefreshTokenResponse = (user: IUserDocument, accessToken: string, refreshToken: string): ICreateToken => {
  return {
    id: user.id.toString(),
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

//For create a token function
export const createTokenService = async (loginData: IUserLogin): Promise<ICreateToken> => {
  const user = await User.findOne({
    email: loginData.email,
  });

  if (!user) {
    throw new HttpError(400, "Email id not registered.");
  }
  const isPasswordValid = await comparePassword(loginData.password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(400, "Invalid  password provided.");
  }

  const { accessToken, refreshToken } = generateTokens({ id: user.id, role: user.role, email: user.email });
  return createAndRefreshTokenResponse(user, accessToken, refreshToken);
};

// Add refresh token function
export const refreshAccessTokenService = async (req: Request): Promise<ICreateToken> => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new HttpError(400, "No refresh token received, kindly relogin");
  }
  if (!REFRESH_TOKEN_SECRET || !ACCESS_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRY || !REFRESH_TOKEN_EXPIRY) {
    throw new HttpError(400, "Access token, Refresh token, Access Expiry or Refresh Expiry must be missing in env");
  }
  let decoded: DecodedToken;
  try {
    decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as DecodedToken;
  } catch (error) {
    throw new HttpError(400, "Invalid or expired refresh token", error);
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new HttpError(400, "User not found in db.");
  }
  const { accessToken, refreshToken } = generateTokens({ id: user.id, role: user.role, email: user.email });
  return createAndRefreshTokenResponse(user, accessToken, refreshToken);
};
