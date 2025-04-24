import { NextFunction, Response } from "express";
import { updateProfileService, updateProfilePasswordService } from "../services/user.services.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { RequestWithUser } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

//Only use after authorization middleware only
//No different service
export const fetchProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData = req.user;
    return res.status(201).json(new ApiResponse(true, "User data fetched successfully", userData));
  } catch (error) {
    return next(new HttpError(500, "Unexpected Error: Unable to fetch user details", error));
  }
};

export const updateProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const updatedUserData = await updateProfileService(req);
    return res.status(200).json(new ApiResponse(true, "User profile details updated successfully", updatedUserData));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexpected Error: Failed to update user profile", error));
  }
};

export const updateProfilePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await updateProfilePasswordService(req);
    return res.status(200).json(new ApiResponse(true, "User password updated successfully", user));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(401, "Unexpected Error: Failed to update user password.", error));
  }
};
