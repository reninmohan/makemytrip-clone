import jwt from "jsonwebtoken";
import ENV from "../config/env.config.js";
import { UserDocument, UserModal } from "../db/models/UserModel.js";
import { UserLogin } from "../schemas/user.schema.js";
import { HttpError } from "../utils/error.utils.js";
import { comparePassword } from "../utils/index.js";
import { UserResponse } from "../types/user.types.js";
import { Request } from "express";

interface ICreateToken extends UserResponse {
  token: string;
}

const createTokenResponse = (user: UserDocument, token: string): ICreateToken => {
  return {
    id: user.id.toString(),
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
    token,
  };
};

//For create a token
export const createToken = async (loginData: UserLogin) => {
  const user = await UserModal.findOne({
    email: loginData.email,
  });

  if (!user) {
    throw new HttpError(401, "Email id not registered.");
  }

  const isPasswordValid = await comparePassword(loginData.password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  if (!ENV.JWT_SECRET) {
    throw new HttpError(401, "JWT Secret missing in env");
  }

  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, ENV.JWT_SECRET, {
    expiresIn: "1d",
  });

  return createTokenResponse(user, token);
};

//For verify already existing token in headers

export interface IVerifyToken {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
}

const verifyTokenResponse = (user: UserDocument): IVerifyToken => {
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

  if (!ENV.JWT_SECRET) {
    throw new HttpError(401, "JWT Secret Key Missing in Env");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
  } catch (error) {
    throw new HttpError(401, "Invalid or expired token", error);
  }

  const user = await UserModal.findById(decoded.id);
  if (!user) {
    throw new HttpError(401, "User not found");
  }

  return verifyTokenResponse(user);
};
