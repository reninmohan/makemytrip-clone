import { User } from "../db/models/user.model.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { generateTokens } from "../utils/generateToken.utils.js";
import { comparePassword } from "../utils/password.utils.js";
import { IUserLogin } from "../schemas/user.schema.js";
import { createAndRefreshTokenResponse } from "./auth.services.js";

export const loginByAdminService = async (req: IUserLogin) => {
  const { email, password } = req;

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new HttpError(401, "User not found in db");
  }

  if (user.role !== "admin") {
    throw new HttpError(401, "User is not authorized for admin access.");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid password provided");
  }

  const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email, role: user.role });

  return createAndRefreshTokenResponse(user, accessToken, refreshToken);
};
