import { IUserDocument, User } from "../db/models/user.model.js";
import { RequestWithUser } from "../middlewares/auth.middleware.js";
import { UserRegistration } from "../schemas/user.schema.js";
import { IUserResponse } from "../types/user.types.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";
import { MongoServerError } from "mongodb";

//Converting db document back to object and santize it to remove sensitive data.
const toUserResponse = (user: IUserDocument): IUserResponse => {
  return {
    id: user.id.toString(),
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
  };
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Getting data as per input for that reason use zod schema type
export const createUser = async (userData: UserRegistration): Promise<IUserResponse> => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.cause instanceof MongoServerError && error?.cause?.code === 11000) {
      const errorMessage = Object.keys(error?.cause.keyValue)[0];
      throw new HttpError(401, `User ${errorMessage} should be unique`, error.cause);
    }
    throw new HttpError(500, "Unexpected Error: Failed to create user in database", error);
  }

  return toUserResponse(user);
};

//Get User by Id
// export const getUserById = async (id: string): Promise<IUserResponse | null> => {
//   const user = await User.findById(id);
//   if (!user) {
//     return null;
//   }
//   return toUserResponse(user);
// };

/////////////////////////////////////////////////////////////////////////////////////////////////////

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
  const updatedUser = await User.findById(user.id).select("-password");

  if (updatedUser) {
    return toUserResponse(updatedUser);
  }

  throw new HttpError(400, "Failed to update user profile");
};

////////////////////////////////////////////////////////////////////////////////////////////

export const changeProfilePasswordService = async (req: RequestWithUser): Promise<IUserResponse> => {
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

  const updatedUser = await User.findById(user.id).select("-password -createdAt -updatedAt");

  if (updatedUser) {
    return toUserResponse(updatedUser);
  }
  throw new HttpError(400, "Failed to update user profile");
};
