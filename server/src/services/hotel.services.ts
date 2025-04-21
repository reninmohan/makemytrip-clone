import { HttpError } from "../utils/ErrorResponse.utils.js";
import { Hotel } from "../db/models/hotel.model.js";
import { Request } from "express";
import { IVerifyToken } from "./auth.services.js";
import { IHotel } from "../types/hotel.types.js";
import { MongoServerError } from "mongodb";
import { RequestWithUser } from "../middlewares/auth.middleware.js";

export interface RequestWithUserAndBody<T> extends Request {
  user?: IVerifyToken;
  body: T & {
    images?: string[];
  };
}

export const createHotelService = async (hotelData: RequestWithUserAndBody<IHotel>) => {
  try {
    const hotel = new Hotel({ ...hotelData.body });
    await hotel.save();
    return hotel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.cause instanceof MongoServerError && error?.cause?.code === 11000) {
      const errorMessage = Object.keys(error?.cause.keyValue)[0];
      throw new HttpError(401, `Hotel ${errorMessage} should be unique`, error.cause);
    }
    throw new HttpError(500, "Unexpected Error: Failed to create hotel in database", error);
  }
};

export const updateHotelService = async (hotelData: RequestWithUserAndBody<Partial<IHotel>>) => {
  try {
    const { hotelId } = hotelData.params;
    if (!hotelId) {
      throw new HttpError(401, "Hotel Id params is required for updatation.");
    }
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new HttpError(404, "Hotel not found in db.");
    }

    Object.assign(hotel, hotelData.body);
    await hotel.save();

    return hotel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.cause instanceof MongoServerError && error?.cause?.code === 11000) {
      const errorMessage = Object.keys(error?.cause.keyValue)[0];
      throw new HttpError(401, `Hotel ${errorMessage} should be unique`, error.cause);
    }
    throw new HttpError(500, "Unexcepted Error : Unable to update hotel details.", error);
  }
};

export const deleteHotelService = async (req: RequestWithUser) => {
  const { hotelId } = req.params;
  if (!hotelId) {
    throw new HttpError(401, "Hotel Id param is required for deletion.");
  }

  const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

  if (!deletedHotel) {
    throw new HttpError(404, "Hotel not found or already deleted.");
  }

  return deletedHotel;
};

export const fetchHotelService = async (req: RequestWithUser) => {
  const { hotelId } = req.params;

  if (!hotelId) {
    throw new HttpError(401, "Hotel Id is required for fetch details.");
  }

  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new HttpError(404, "Hotel not found");
  }

  return hotel;
};
