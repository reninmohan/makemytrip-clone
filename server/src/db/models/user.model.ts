import mongoose, { Document } from "mongoose";
import { IUserRegistration } from "../../schemas/user.schema.js";

// Document is a mongoose special type
export interface IUserDocument extends IUserRegistration, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUserDocument>("User", UserSchema);

//Public Routes

// can book flights and hotels
// also used to store admin and user details
