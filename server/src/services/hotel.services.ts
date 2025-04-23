import { HttpError } from "../utils/ErrorResponse.utils.js";
import { Hotel, HotelBooking, IHotelDocument, RoomType } from "../db/models/hotel.model.js";
import { IHotel, IHotelResponse, IRoomTypeResponse } from "../schemas/hotel.schema.js";
import { MongoServerError } from "mongodb";
import { RequestWithUser, RequestWithUserAndBody } from "../middlewares/auth.middleware.js";
import { toRoomTypeResponse } from "./roomType.services.js";
import { Request } from "express";

// Admin related hotel routes.

export const toHotelResponse = (hotel: IHotelDocument): IHotelResponse => {
  return {
    id: hotel?.id.toString(),
    name: hotel?.name,
    description: hotel?.description,
    location: {
      city: hotel?.location?.city,
      state: hotel?.location?.state,
      country: hotel?.location?.country,
      address: hotel?.location?.address,
      coordinates: {
        latitude: hotel?.location?.coordinates.latitude,
        longitude: hotel?.location?.coordinates.longitude,
      },
    },
    images: hotel?.images,
    rating: hotel?.rating,
    amenities: hotel?.amenities,
    roomTypes: hotel?.roomTypes?.map((roomType) => toRoomTypeResponse(roomType)),
  };
};

export const createHotelService = async (req: RequestWithUserAndBody<IHotel>): Promise<IHotelResponse> => {
  if (req.body.images.length === 0 || !Array.isArray(req.body.images)) {
    throw new HttpError(401, "Images url are empty.At least one image is required.");
  }

  const hotel = new Hotel({ ...req.body });

  try {
    await hotel.save();
    return toHotelResponse(hotel);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.cause instanceof MongoServerError && error?.cause?.code === 11000) {
      const errorMessage = Object.keys(error?.cause.keyValue)[0];
      throw new HttpError(401, `Hotel ${errorMessage} should be unique`, error.cause);
    }
    throw error;
  }
};

export const updateHotelService = async (req: RequestWithUserAndBody<Partial<IHotel>>): Promise<IHotelResponse> => {
  const { hotelId } = req.params;
  if (!hotelId) {
    throw new HttpError(401, "Hotel Id params is required for updatation.");
  }
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    throw new HttpError(404, "Hotel not found in db.");
  }

  Object.assign(hotel, req.body);

  try {
    await hotel.save();
    return toHotelResponse(hotel);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.cause instanceof MongoServerError && error?.cause?.code === 11000) {
      const errorMessage = Object.keys(error?.cause.keyValue)[0];
      throw new HttpError(401, `Hotel ${errorMessage} should be unique`, error.cause);
    }
    throw error;
  }
};

export const deleteHotelService = async (req: RequestWithUser): Promise<IHotelResponse> => {
  const { hotelId } = req.params;
  if (!hotelId) {
    throw new HttpError(401, "Hotel Id param is required for deletion.");
  }

  const deletedHotel = await Hotel.findByIdAndDelete(hotelId).populate("roomTypes");

  if (!deletedHotel) {
    throw new HttpError(404, "Hotel not found or already deleted.");
  }
  return toHotelResponse(deletedHotel);
};

////////////////////////////////////////////////////////////////////////

// Public rotues for non logged or logged users.

export const fetchSpecficHotelService = async (req: RequestWithUser): Promise<IHotelResponse> => {
  const { hotelId } = req.params;

  if (!hotelId) {
    throw new HttpError(401, "Hotel Id is required for fetch details.");
  }

  const hotel = await Hotel.findById(hotelId).populate("roomTypes");

  if (!hotel) {
    throw new HttpError(404, "Hotel not found");
  }

  return toHotelResponse(hotel);
};

export const fetchAllHotelsService = async (): Promise<IHotelResponse[]> => {
  const hotels = await Hotel.find({}).populate("roomTypes");
  // const hotels = await Hotel.find({});

  if (!hotels.length) {
    throw new HttpError(404, "No hotels found.");
  }

  return hotels.map((hotel) => toHotelResponse(hotel));
};

export const fetchAllRoomsByHotelService = async (req: Request): Promise<IRoomTypeResponse[]> => {
  const { hotelId } = req.params;

  if (!hotelId) {
    throw new HttpError(401, "HotelId params is not provided for roomtype search.");
  }

  const roomTypes = await RoomType.find({ hotel: hotelId });

  if (!roomTypes.length) {
    throw new HttpError(401, "No roomtypes exists for mentioned hotel.");
  }

  return roomTypes.map((roomtype) => toRoomTypeResponse(roomtype));
};

interface IHotelAvailable extends IRoomTypeResponse {
  availableCount: number;
}

export const checkHotelAvailabilityService = async (req: RequestWithUser): Promise<IHotelAvailable[]> => {
  const { hotelId } = req.params;
  if (!hotelId) {
    throw new HttpError(400, "hotelId param is required to check for hotel availability.");
  }

  const { checkInDate, checkOutDate } = req.body;
  if (!checkInDate || !checkOutDate) {
    throw new HttpError(400, "Check-in and Check-out dates are required.");
  }

  const roomTypes = await RoomType.find({ hotel: hotelId });
  if (!roomTypes.length) {
    throw new HttpError(404, "No roomtypes exist for this hotel.");
  }

  const availableRooms = [];

  for (const roomType of roomTypes) {
    const existingBookings = await HotelBooking.find({
      roomType: roomType._id,
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) },
    });
    const bookedCount = existingBookings.length;
    const availableCount = roomType.countInStock - bookedCount;

    if (availableCount > 0) {
      availableRooms.push({
        ...toRoomTypeResponse(roomType),
        availableCount,
      });
    }
  }

  return availableRooms;

  /*
  const availableRooms = await Promise.all(
    roomTypes.map(async (roomType) => {
      const existingBookings = await HotelBooking.find({
        roomType: roomType._id,
        checkInDate: { $lt: new Date(checkOutDate) },
        checkOutDate: { $gt: new Date(checkInDate) },
      });
      const bookedCount = existingBookings.length;
      const availableCount = roomType.countInStock - bookedCount;
  
      if (availableCount > 0) {
        return {
          ...toRoomTypeResponse(roomType),
          availableCount,
        };
      }
      return null;
    })
  );
  
  return availableRooms.filter(Boolean);
  
*/
};
