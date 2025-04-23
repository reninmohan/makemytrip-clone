import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { loginByAdminService } from "../services/admin.services.js";
import { setRefreshToken } from "../utils/setRefreshToken.utils.js";

export const loginByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken, ...response } = await loginByAdminService(req.body);
    setRefreshToken(res, refreshToken);
    return res.status(200).json(
      new ApiResponse(true, "Successfully login by admin", {
        response,
      }),
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(401, "Unexcepted Error: Failed to login as admin."));
  }
};
