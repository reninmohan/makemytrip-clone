import mongoose, { Document } from "mongoose";
import { IUser } from "../../types/user.types.js";

// Document is a mongoose special type
export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>(
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

export const User = mongoose.model<IUserDocument>("User", userSchema);
// can book flights and hotels
// also used to store admin and user details
