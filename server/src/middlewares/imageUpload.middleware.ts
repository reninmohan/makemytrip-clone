import { Response, NextFunction } from "express";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";
import { RequestWithUser } from "./auth.middleware.js";

export interface IMulterFile {
  fieldname: string; // Form field name (e.g., 'images')
  originalname: string; // Original file name from user's computer
  encoding: string; // File encoding ('7bit' usually)
  mimetype: string; // MIME type (e.g., 'image/png')
  size: number; // File size in bytes
  destination: string; // Destination folder (only if using diskStorage)
  filename: string; // Saved file name on server
  path: string; // Full path where file is stored
  buffer?: Buffer; // Only if using memoryStorage (optional)
}

export const handleImageUpload = async (req: RequestWithUser & { files?: IMulterFile }, _res: Response, next: NextFunction) => {
  try {
    if (req.method === "PUT" && (req.files?.length === 0 || !req.files)) {
      return next();
    }

    if (!req?.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next(new HttpError(400, "At least one image is required"));
    }

    if (req.files.length > 6) {
      return next(new HttpError(400, "Maximum 6 images are allowed"));
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(async (file: IMulterFile) => {
      const result = await uploadOnCloudinary(file.path);
      if (!result) {
        throw new HttpError(500, "Failed to upload image to Cloudinary");
      }
      return result.url;
    });

    try {
      const imageUrls = await Promise.all(uploadPromises);
      if (imageUrls.length > 0) {
        req.body.images = imageUrls;
      }
      return next();
    } catch (error) {
      return next(new HttpError(500, "Unexpected Error: Failed to upload one or more images", error));
    }
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexpected Error: Failed to process the images.", error));
  }
};

export const handleSingleImageUpload = async (req: RequestWithUser & { file?: IMulterFile }, _res: Response, next: NextFunction) => {
  try {
    if (req.method === "PUT" && !req.file) {
      return next();
    }

    if (!req.file) {
      throw new HttpError(400, "Image is required");
    }

    const result = await uploadOnCloudinary(req.file.path);
    if (!result) {
      throw new HttpError(500, "Failed to upload image to Cloudinary.");
    }
    req.body.logo = result.url;

    return next();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexpected Error:  Failed to upload image", error));
  }
};
