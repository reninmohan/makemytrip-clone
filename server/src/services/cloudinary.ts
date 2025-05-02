import { v2 as cloudinary } from "cloudinary";
import ENV from "../config/env.config.js";
import fs from "fs";
import { HttpError } from "../utils/ErrorResponse.utils.js";

// Configuration
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

interface ICloudinaryResponse {
  url: string;
  public_id: string;
  secure_url: string;
  // Add other Cloudinary response properties as needed
}

// Upload an image
export const uploadOnCloudinary = async (localFilePath: string): Promise<ICloudinaryResponse | null> => {
  if (!localFilePath) {
    throw new HttpError(400, "Local file path is required");
  }

  if (!fs.existsSync(localFilePath)) {
    throw new HttpError(404, "File not found at the specified path");
  }

  try {
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Clean up the local file
    try {
      fs.unlinkSync(localFilePath);
    } catch (error) {
      console.error("Error deleting local file:", error);
    }

    return response;
  } catch (error) {
    console.error("Error while uploading to Cloudinary:", error);

    // Clean up the local file
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (deleteError) {
      console.error("Error deleting local file:", deleteError);
    }

    return null;
  }
};
