import { NextFunction, Request, Response } from "express";
import { createToken } from "../services/auth.services.js";
import { HttpError } from "../utils/error.utils.js";

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createToken(req.body);
    console.log("User logged in and token created");

    const token = user.token;

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const response = { message: "Login successfully", user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, phone: user.phoneNumber } };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(401, "Unable to login check email and password", error));
  }
};
