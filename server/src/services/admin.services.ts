import { User } from "../db/models/user.model.js";
import { RequestWithUser } from "../middlewares/auth.middleware.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { generateTokens } from "../utils/generateToken.utils.js";
import { comparePassword } from "../utils/password.utils.js";

export const loginByAdminService = async (req: RequestWithUser) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(401, "Both email and password is required in body for login.");
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new HttpError(401, "User not found in db");
  }

  if (user.role !== "admin") {
    throw new HttpError(401, "User is not authorized for admin access.");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
  };

  const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email, role: user.role });

  return { user: req.user, accessToken, refreshToken };
};
