import { IUserDocument, User } from "../db/models/user.model.js";
import { RequestWithUser } from "../middlewares/auth.middleware.js";
import { IUserResponse } from "../types/user.types.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";

//Converting db document back to object and santize and remove sensitive data.
export const toUserResponse = (user: IUserDocument): IUserResponse => {
  return {
    id: user.id.toString(),
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
  };
};

export const updateProfileService = async (reqData: RequestWithUser): Promise<IUserResponse> => {
  const { user: authUser } = reqData;

  if (!authUser) {
    throw new HttpError(401, "Unauthorized access to update profile.");
  }

  const user = await User.findById(authUser.id);

  if (!user) {
    throw new HttpError(404, "User not found in db.");
  }

  const { fullName, email, phoneNumber } = reqData.body;

  if (phoneNumber && phoneNumber !== user.phoneNumber) {
    const existingUserWithPhone = await User.findOne({ phoneNumber, _id: { $ne: authUser.id } });
    if (existingUserWithPhone) {
      throw new HttpError(400, "Phone number is already in use by another account.");
    }
  }

  if (email && email !== user.email) {
    const existingUserWithEmail = await User.findOne({ email, _id: { $ne: authUser.id } });
    if (existingUserWithEmail) {
      throw new HttpError(400, "Email is already in use by another account.");
    }
  }

  // Update only fields that are provided
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  // if (role) user.role = role;
  await user.save();
  return toUserResponse(user);
};

////////////////////////////////////////////////////////////////////////////////////////////

export const updateProfilePasswordService = async (req: RequestWithUser): Promise<IUserResponse> => {
  const reqData = req.user;

  if (!reqData) {
    throw new HttpError(401, "Unauthorized access cannot change password.");
  }

  const newPassword = req.body?.password;

  if (!newPassword) {
    throw new HttpError(401, "New Password not recieved in body.");
  }

  const user = await User.findById(reqData?.id);
  if (!user) {
    throw new HttpError(404, "User not found in db.", null);
  }

  const isSamePassword = await comparePassword(newPassword, user.password);

  if (!isSamePassword) {
    user.password = await hashPassword(newPassword);
  }

  await user.save();
  return toUserResponse(user);
};
