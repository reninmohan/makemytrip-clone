import { Request, NextFunction, Response } from "express";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { IVerifyToken } from "../services/auth.services.js";
import { IMulterFile } from "./imageUpload.middleware.js";

export const testmidandcontroller = async (req: Request & { user?: IVerifyToken; files?: IMulterFile }, res: Response, next: NextFunction) => {
  try {
    const images = req.body.images;
    res.json({
      success: true,
      message: "Files uploaded successfully",
      data: images,
    });
  } catch (error) {
    console.error("Error in test middleware");
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Failed to process file upload", error));
  }
};
