import { NextFunction, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import {
  createFlightBookingService,
  createHotelBookingService,
  deleteSpecificUserFlightBookingService,
  deleteSpecificUserHotelBookingService,
  fetchAllAdminFlightBookingService,
  fetchAllUserFlightBookingService,
  fetchAllUserHotelBookingService,
  fetchSpecificUserHotelBookingService,
  showAllHotelBookingService,
} from "../services/booking.services.js";
import { RequestWithUser, RequestWithUserAndBody } from "../middlewares/auth.middleware.js";
import { ICreateHotelBooking } from "../schemas/hotel.schema.js";
import { ICreateFlightBooking } from "../schemas/flight.schema.js";

//For create hotel booking
export const createHotelBooking = async (req: RequestWithUserAndBody<ICreateHotelBooking>, res: Response, next: NextFunction) => {
  try {
    const booking = await createHotelBookingService(req);
    return res.status(201).json(new ApiResponse(true, "Hotel Booking successfully.", booking));
  } catch (error) {
    console.error("server", error);
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to create Hotel booking"));
  }
};

// For admin specific hotel  booking operation

export const showAllHotelBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const booking = await showAllHotelBookingService();
    return res.status(200).json(new ApiResponse(true, "All Hotel Booking successfully.", booking));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all  Hotel booking"));
  }
};

export const showAllFlightBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const booking = await fetchAllAdminFlightBookingService();
    return res.status(200).json(new ApiResponse(true, "All flight Booking successfully.", booking));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all  flight booking"));
  }
};

// For user specific hotel booking operation

export const fetchAllUserHotelBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const hotels = await fetchAllUserHotelBookingService(req);
    return res.status(200).json(new ApiResponse(true, "Fetch all hotel booking details of user  successfully.", hotels));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all hotel booking details of user", error));
  }
};

export const fetchSpecificUserHotelBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const hotels = await fetchSpecificUserHotelBookingService(req);
    return res.status(200).json(new ApiResponse(true, "Fetch all hotel booking details of user  successfully.", hotels));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all hotel booking details of user", error));
  }
};

export const deleteSpecificUserHotelBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const hotels = await deleteSpecificUserHotelBookingService(req);
    return res.status(200).json(new ApiResponse(true, "Deleted booking details of user successfully.", hotels));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all hotel booking details of user", error));
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const createFlightBooking = async (req: RequestWithUserAndBody<ICreateFlightBooking>, res: Response, next: NextFunction) => {
  try {
    const booking = await createFlightBookingService(req);
    return res.status(201).json(new ApiResponse(true, "Hotel Booking successfully.", booking));
  } catch (error) {
    console.error("server", error);
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to create flight  booking"));
  }
};

export const fetchAllUserFlightBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const flightbooking = await fetchAllUserFlightBookingService(req);
    return res.status(200).json(new ApiResponse(true, "Fetch all flight  booking details of user  successfully.", flightbooking));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all flight booking details of user", error));
  }
};

export const deleteSpecificUserFlightBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const hotels = await deleteSpecificUserFlightBookingService(req);
    return res.status(200).json(new ApiResponse(true, "Deleted booking details of user successfully.", hotels));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to delete  flight  booking details of user", error));
  }
};
