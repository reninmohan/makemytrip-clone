/* eslint-disable @typescript-eslint/no-explicit-any */
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
    id: hotel?._id.toString(),
    name: hotel?.name,
    description: hotel?.description,
    location: {
      city: hotel?.location?.city,
      state: hotel?.location?.state,
      country: hotel?.location?.country,
      address: hotel?.location?.address,
      coordinates: {
        latitude: hotel?.location?.coordinates?.latitude,
        longitude: hotel?.location?.coordinates?.longitude,
      },
    },
    images: hotel?.images,
    rating: hotel?.rating,
    amenities: hotel?.amenities,
    roomTypes: hotel?.roomTypes?.map((roomType) => toRoomTypeResponse(roomType)),
    updatedAt: hotel?.updatedAt,
    createdAt: hotel?.createdAt,
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
    throw new HttpError(400, "Hotel Id params is required for updatation.");
  }
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    throw new HttpError(404, "Hotel not found in db.");
  }

  Object.assign(hotel, req.body);

  try {
    await hotel.save();
    return toHotelResponse(hotel);
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

export const getAllHotelsService = async () => {
  const toAllHotelResponse = (hotel: IHotelDocument) => {
    return {
      id: hotel?.id.toString(),
      name: hotel?.name,
      location: {
        city: hotel?.location?.city,
        state: hotel?.location?.state,
        country: hotel?.location?.country,
        address: hotel?.location?.address,
        coordinates: {
          latitude: hotel?.location?.coordinates?.latitude,
          longitude: hotel?.location?.coordinates?.longitude,
        },
      },
      rating: hotel?.rating,
      createdAt: hotel?.createdAt,
    };
  };
  const allHotelsDetails = await Hotel.find({});
  return allHotelsDetails.map((booking) => toAllHotelResponse(booking));
};

////////////////////////////////////////////////////////////////////////

// Public rotues for non logged or logged users.

export const getHotelService = async (req: RequestWithUser): Promise<IHotelResponse> => {
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

//Fetch all hotel with filteration.
export const filterAndSearchAllHotelsService = async (req: Request): Promise<{ hotels: IHotelResponse[]; totalHotels: number }> => {
  const { destination, amenities, minPrice, maxPrice, capacity, rating, checkInDate, checkOutDate } = req.query;

  const query: any = {};

  if (destination) {
    const regex = new RegExp(destination as string, "i");
    query.$or = [{ "location.city": { $regex: regex } }, { "location.state": { $regex: regex } }, { "location.country": { $regex: regex } }];
  }

  if (rating) query.rating = { $gte: Number(rating) };

  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : (amenities as string).split(",");
    query.amenities = { $all: amenitiesArray };
  }

  // Initial find with population
  const allHotels = await Hotel.find(query).populate("roomTypes");

  const finalHotels = [];

  for (const hotel of allHotels) {
    const availableRoomTypes = [];

    for (const room of hotel.roomTypes) {
      // Apply price & guest filters
      const matchesPrice = (!minPrice || room.pricePerNight >= Number(minPrice)) && (!maxPrice || room.pricePerNight <= Number(maxPrice));
      const matchesGuests = !capacity || room.capacity >= Number(capacity);

      if (!matchesPrice || !matchesGuests) continue;

      // If dates are provided, check room availability
      if (checkInDate && checkOutDate) {
        const conflictingBookings = await HotelBooking.find({
          roomType: room._id,
          checkInDate: { $lt: new Date(checkOutDate as string) },
          checkOutDate: { $gt: new Date(checkInDate as string) },
        });

        const bookedCount = conflictingBookings.length;
        const availableCount = room.countInStock - bookedCount;

        if (availableCount > 0) {
          availableRoomTypes.push(room);
        }
      } else {
        // No date filter — assume all rooms are available
        availableRoomTypes.push(room);
      }
    }

    // Only include hotel if it has at least one available room
    if (availableRoomTypes.length > 0) {
      hotel.roomTypes = availableRoomTypes;
      finalHotels.push(hotel);
    }
  }
  return {
    hotels: finalHotels.map((hotel) => toHotelResponse(hotel)),
    totalHotels: finalHotels.length,
  };
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
};
