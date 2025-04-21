import { Response, NextFunction } from "express";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { RequestWithUserAndBody, updateHotelService, createHotelService, deleteHotelService, fetchHotelService } from "../services/hotel.services.js";
import { IHotel } from "../types/hotel.types.js";
import { RequestWithUser } from "../middlewares/auth.middleware.js";

export const createHotel = async (req: RequestWithUserAndBody<IHotel>, res: Response, next: NextFunction) => {
  try {
    const hotel = await createHotelService(req);
    return res.status(201).json(new ApiResponse(true, "Hotel created successfully", hotel));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexpected Error: Failed to create hotel", error));
  }
};

export const updateHotel = async (req: RequestWithUserAndBody<IHotel>, res: Response, next: NextFunction) => {
  try {
    const hotel = await updateHotelService(req);
    return res.status(201).json(new ApiResponse(true, "Hotel details updated successfully", hotel));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexpected Error: Failed to updated hotel details", error));
  }
};

export const deleteHotel = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const hotel = await deleteHotelService(req);
    return res.status(200).json(new ApiResponse(true, "Hotel deleted successfully", hotel));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexpected Error: Failed to delete hotel", error));
  }
};

export const fetchHotel = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const hotel = await fetchHotelService(req);

    return res.status(200).json(new ApiResponse(true, "Fetch Hotel details successfully.", hotel));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch hotel details.", error));
  }
};
