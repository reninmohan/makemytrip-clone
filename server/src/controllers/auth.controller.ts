import { NextFunction, Request, Response } from "express";
import { createToken, refreshToken } from "../services/auth.services.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { RequestWithUser } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { setRefreshToken } from "../utils/setRefreshToken.utils.js";

export const loginUserAndCreateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createToken(req.body);
    const { accessToken, refreshToken } = user;

    setRefreshToken(res, refreshToken);

    const response = { id: user.id, fullName: user.fullName, email: user.email, role: user.role, phone: user.phoneNumber, accessToken };

    return res.status(200).json(new ApiResponse(true, "User logged in and token created", response));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexpected Error: Unable to auth user", error));
  }
};

export const loginSuccessTest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData = req.user;
    return res.status(200).json(new ApiResponse(true, "User data fetched successfully", userData));
  } catch (error) {
    return next(new HttpError(500, "Unexpected Error: Unable to login user", error));
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenResponse = await refreshToken(req);

    const { accessToken, refreshToken: newRefreshToken } = tokenResponse;

    setRefreshToken(res, newRefreshToken);

    return res.status(200).json(new ApiResponse(true, "Access & Refresh token refreshed", { accessToken }));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unnexpected Error: Unable to refresh tokens", error));
  }
};

//No service direct controller
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies?.refreshToken) {
      throw new HttpError(401, "Authorized user no cookie in req.");
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0, // Immediately expire the cookie
    });
    console.log("TODO");
    console.log("In frontend write logic to manually clear the localstorage");
    return res.status(200).json(new ApiResponse(true, "Successfully logged out", "Cleared cookie"));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(401, "Unexpected Error: Unable to logout user", error));
  }
};
