import { UserDocument, UserModal } from "../db/models/index.js";
import { UserCreate } from "../schemas/index.js";
import { UserResponse } from "../types/user.types.js";
import { HttpError } from "../utils/index.js";
import { hashPassword } from "../utils/index.js";

//Converting db document back to object and santize it to remove sensitive data.
const toUserResponse = (user: UserDocument): UserResponse => {
  return {
    id: user.id.toString(),
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updateAt,
    role: user.role,
  };
};

//Getting data as per input for that reason use zod schema type
export const createUser = async (userData: UserCreate): Promise<UserResponse> => {
  const existingUser = await UserModal.findOne({ email: userData.email });

  if (existingUser) {
    throw new HttpError(409, "User with this email id already exists");
  }
  //hash password before storing in db.
  const hashedPassword = await hashPassword(userData.password);

  //create new document instance.
  const user = new UserModal({
    ...userData,
    password: hashedPassword,
  });

  await user.save();
  return toUserResponse(user);
};

export const getUserById = async (id: string) => {
  const user = await UserModal.findById(id);
  if (!user) return null;
  return toUserResponse(user);
};
