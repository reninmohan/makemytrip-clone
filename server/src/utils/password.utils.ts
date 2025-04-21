import bcrypt from "bcrypt";
import ENV from "../config/env.config.js";

export const hashPassword = async (password: string): Promise<string> => {
  const SALT_ROUND = Number(ENV.SALT_ROUND) || 10;
  const salt = await bcrypt.genSalt(SALT_ROUND);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
