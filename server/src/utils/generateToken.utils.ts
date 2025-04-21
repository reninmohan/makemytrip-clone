import jwt from "jsonwebtoken";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import ENV from "../config/env.config.js";

const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = ENV;

interface IGenerateTokensInput {
  id: string;
  email: string;
  role: string;
}

interface IGenerateTokensOutput {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (user: IGenerateTokensInput): IGenerateTokensOutput => {
  if (!ACCESS_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRY || !REFRESH_TOKEN_SECRET || !REFRESH_TOKEN_EXPIRY) {
    throw new HttpError(500, "Token secrets or expiry times are missing in environment variables");
  }

  const accessToken = jwt.sign({ id: user.id, role: user.role, email: user.email }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY as string | number,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY as string | number,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};
