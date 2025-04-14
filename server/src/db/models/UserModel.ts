import mongoose, { Document } from "mongoose";
import { User } from "../../types/user.types.js";

// Document is a mongoose special type
export interface UserDocument extends User, Document {
  createdAt: Date;
  updateAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export const UserModal = mongoose.model<UserDocument>("User", userSchema);
