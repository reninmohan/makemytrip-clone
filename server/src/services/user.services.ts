import { IUserDocument, User } from "../db/models/user.model.js";
import { UserRegistration } from "../schemas/user.schema.js";
import { IUserResponse } from "../types/user.types.js";
import { HttpError } from "../utils/error.utils.js";
import { hashPassword } from "../utils/password.utils.js";

//Converting db document back to object and santize it to remove sensitive data.
const toUserResponse = (user: IUserDocument): IUserResponse => {
  return {
    id: user.id.toString(),
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    phoneNumber: user.phoneNumber,
    role: user.role,
  };
};

//Getting data as per input for that reason use zod schema type
export const createUser = async (userData: UserRegistration): Promise<IUserResponse> => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw new HttpError(409, "User with this email id already exists");
  }
  //hash password before storing in db.
  const hashedPassword = await hashPassword(userData.password);

  //create new document instance.
  const user = new User({
    ...userData,
    password: hashedPassword,
  });

  await user.save();
  return toUserResponse(user);
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) return null;
  return toUserResponse(user);
};
