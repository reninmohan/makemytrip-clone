import { Response, NextFunction, Request } from "express";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { updateHotelService, createHotelService, deleteHotelService, fetchSpecficHotelService, fetchAllRoomsByHotelService, checkHotelAvailabilityService, filterAndSearchAllHotelsService } from "../services/hotel.services.js";
import { IHotel } from "../schemas/hotel.schema.js";
import { RequestWithUser, RequestWithUserAndBody } from "../middlewares/auth.middleware.js";

// Admin related routes only

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
    return res.status(200).json(new ApiResponse(true, "Hotel details updated successfully", hotel));
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

export const fetchSpecificHotel = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const hotel = await fetchSpecficHotelService(req);

    return res.status(200).json(new ApiResponse(true, "Fetch Hotel details successfully.", hotel));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch hotel details.", error));
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Public routes for hotel routes

export const filterAndSearchAllHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await filterAndSearchAllHotelsService(req);
    return res.status(200).json(new ApiResponse(true, "Fetch All  Hotel details successfully.", hotels));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all hotel details.", error));
  }
};

export const fetchAllRoomsByHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await fetchAllRoomsByHotelService(req);
    return res.status(200).json(new ApiResponse(true, "Fetch all Room details for the hotel  successfully.", hotels));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all room details for hotel.", error));
  }
};

export const checkHotelAvailability = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const hotels = await checkHotelAvailabilityService(req);
    return res.status(200).json(new ApiResponse(true, "Fetch all Room details for the hotel  successfully.", hotels));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all room details for hotel.", error));
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
