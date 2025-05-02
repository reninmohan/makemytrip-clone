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
export const filterAndSearchAllHotelsService = async (req: Request): Promise<{ hotels: IHotelResponse[]; totalHotels: number; totalPages: number; currentPage: number }> => {
  const { destination, amenities, minPrice, maxPrice, capacity, rating, page = "1", limit = "10", checkInDate, checkOutDate } = req.query;

  const query: any = {};

  if (destination) {
    const regex = new RegExp(destination as string, "i");
    query.$or = [{ "location.city": { $regex: regex } }, { "location.state": { $regex: regex } }, { "location.country": { $regex: regex } }];
  } else {
    if (req.query.city) query["location.city"] = { $regex: new RegExp(req.query.city as string, "i") };
    if (req.query.state) query["location.state"] = { $regex: new RegExp(req.query.state as string, "i") };
    if (req.query.country) query["location.country"] = { $regex: new RegExp(req.query.country as string, "i") };
  }

  if (rating) query.rating = { $lte: Number(rating) };

  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : (amenities as string).split(",");
    query.amenities = { $all: amenitiesArray };
  }

  // Initial find with population
  const allHotels = await Hotel.find(query).populate("roomTypes");

  let filteredHotels = allHotels;

  if (minPrice || maxPrice || capacity) {
    // Filter by price and guest capacity inside roomTypes
    filteredHotels = allHotels.filter((hotel) =>
      hotel.roomTypes.some((room: any) => {
        const matchesPrice = (minPrice ? room.pricePerNight >= Number(minPrice) : true) && (maxPrice ? room.pricePerNight <= Number(maxPrice) : true);

        const matchesGuests = capacity ? room.capacity >= Number(capacity) : true;

        return matchesPrice && matchesGuests;
      }),
    );
  }

  if (checkInDate && checkOutDate) {
    const conflictingBookings = await HotelBooking.find({
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate as string) },
          checkOutDate: { $gt: new Date(checkInDate as string) },
        },
      ],
    }).select("roomType");

    const unavailableRoomTypeIds = conflictingBookings.map((b) => b.roomType.toString());
    filteredHotels = filteredHotels.filter((hotel) => hotel.roomTypes.some((room: any) => !unavailableRoomTypeIds.includes(room._id.toString())));
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const paginatedHotels = filteredHotels.slice(skip, skip + Number(limit));
  const totalHotels = filteredHotels.length;
  const totalPages = Math.ceil(totalHotels / Number(limit));

  if (!filteredHotels.length) {
    return {
      hotels: [],
      totalHotels: 0,
      totalPages: 0,
      currentPage: Number(page),
    };
  }

  return {
    hotels: paginatedHotels.map((hotel) => toHotelResponse(hotel)),
    totalHotels: totalHotels,
    totalPages,
    currentPage: Number(page),
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

/*

export const filterAndSearchAllFlightsService2 = async (req: Request, res: Response) => {
  try {
    // const validationResult = hotelSearchParamsSchema.safeParse(req.query);
    // console.log(validationResult);
    // if (!validationResult.success) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid search parameters",
    //     errors: validationResult.error.errors,
    //   });
    // }

    // Use the validated and transformed data
    const { city, state, country, amenities, rating, checkInDate, checkOutDate, priceRange, guests, page = "1", limit = "10" } = req.body;

    // Build MongoDB query
    const query: any = {};

    // Location filters - using exact matches but case insensitive
    if (city) query["location.city"] = city;
    if (state) query["location.state"] = state;
    if (country) query["location.country"] = country;

    // Rating filter
    if (rating) query.rating = { $gte: Number(rating) };

    // Amenities filter
    if (amenities && amenities.length > 0) {
      query.amenities = { $all: amenities };
    }

    // Pagination setup
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // First, get all hotels that match basic criteria
    const allHotels = await Hotel.find(query).populate("roomTypes").skip(skip).limit(limitNum);

    // const totalCount = await Hotel.countDocuments(query);

    // For price range and capacity filters, we need to filter after population
    let filteredHotels = allHotels;

    // Filter by price range and guest capacity if specified
    if (priceRange?.min || priceRange?.max || guests) {
      filteredHotels = allHotels.filter((hotel) =>
        hotel.roomTypes.some((room: any) => {
          // Price range filter
          const matchesPrice = (priceRange?.min ? room.pricePerNight >= priceRange.min : true) && (priceRange?.max ? room.pricePerNight <= priceRange.max : true);

          // Guest capacity filter
          const matchesCapacity = guests ? room.capacity >= guests.adults + (guests.children || 0) : true;

          return matchesPrice && matchesCapacity;
        }),
      );
    }

    // If dates are provided, check for availability
    if (checkInDate && checkOutDate) {
      // Find conflicting bookings in the date range
      const conflictingBookings = await HotelBooking.find({
        $or: [
          {
            // Bookings that overlap with requested dates
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate },
          },
        ],
      }).select("roomType hotel");

      // Create lookup maps for quick reference
      const bookedRooms = new Map();
      conflictingBookings.forEach((booking) => {
        const key = `${booking.hotel.toString()}-${booking.roomType.toString()}`;
        const count = bookedRooms.get(key) || 0;
        bookedRooms.set(key, count + 1);
      });

      // Filter out hotels with no available rooms
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.roomTypes.some((room: any) => {
          const key = `${(hotel._id as string).toString()}-${room._id.toString()}`;
          const bookedCount = bookedRooms.get(key) || 0;
          return bookedCount < room.countInStock; // Still have rooms available
        });
      });
    }

    // Calculate pagination details based on filtered results
    const totalHotels = filteredHotels.length;
    const totalPages = Math.ceil(totalHotels / limitNum);

    if (filteredHotels.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No hotels found matching your criteria",
        data: {
          hotels: [],
          pagination: {
            totalHotels: 0,
            totalPages: 0,
            currentPage: pageNum,
            limit: limitNum,
          },
        },
      });
    }

    // Format response
    return res.status(200).json({
      success: true,
      message: "Hotels fetched successfully",
      data: {
        hotels: filteredHotels.map((hotel) => toHotelResponse1(hotel)),
        pagination: {
          totalHotels,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Search hotels error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching for hotels",
      error: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
    });
  }
};

// Helper function for formatting hotel response

const toHotelResponse1 = (hotel: any): IHotelResponse => {
  return {
    id: hotel._id.toString(),
    name: hotel.name,
    description: hotel.description,
    location: hotel.location,
    images: hotel.images,
    rating: hotel.rating,
    amenities: hotel.amenities,
    roomTypes: Array.isArray(hotel.roomTypes)
      ? hotel.roomTypes.map((room: any) => ({
          id: room._id.toString(),
          name: room.name,
          description: room.description,
          capacity: room.capacity,
          pricePerNight: room.pricePerNight,
          amenities: room.amenities,
          images: room.images,
          bedType: room.bedType,
          countInStock: room.countInStock,
        }))
      : [],
  };
};
*/
