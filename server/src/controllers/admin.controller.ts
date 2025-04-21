import { NextFunction, Response } from "express";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { RequestWithUser } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { loginByAdminService } from "../services/admin.services.js";
import { setRefreshToken } from "../utils/setRefreshToken.utils.js";

export const loginByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { refreshToken, accessToken, user } = await loginByAdminService(req);
    setRefreshToken(res, refreshToken);
    return res.status(200).json(
      new ApiResponse(true, "Successfully login by admin", {
        accessToken,
        user,
      }),
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(401, "Unexcepted Error: Failed to login as admin."));
  }
};
