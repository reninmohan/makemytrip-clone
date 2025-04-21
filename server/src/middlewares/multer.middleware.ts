/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
import { HttpError } from "../utils/ErrorResponse.utils.js";

//we are storing at hdd not in memory
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/temp");
  },
  filename: function (_req, file, cb) {
    // Add timestamp to filename to avoid conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// File filter to accept only images
const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new HttpError(400, `File '${file.originalname}' rejected: Only image files are allowed`), false);
  }
};

//use upload as middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
