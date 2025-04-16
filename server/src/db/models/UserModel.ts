import mongoose, { Document } from "mongoose";
import { User } from "../../types/user.types.js";

// Document is a mongoose special type
export interface UserDocument extends User, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  },
);

export const UserModal = mongoose.model<UserDocument>("User", userSchema);
// can book flights and hotels
// also used to store admin and user details
