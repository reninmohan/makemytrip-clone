import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

export const unknownRoute = (req: Request, res: Response) => {
  res.status(404).json(new ApiResponse(false, "Accessing unregistered route", `Cannot ${req.method} at ${req.path}`));
};
