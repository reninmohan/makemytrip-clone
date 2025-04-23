import { ObjectId } from "mongoose";
import { Hotel, HotelBooking, IHotelBookingDocument, IHotelDocument, IRoomTypeDocument, RoomType } from "../db/models/hotel.model.js";
import { IUserDocument } from "../db/models/user.model.js";
import { RequestWithUser, RequestWithUserAndBody } from "../middlewares/auth.middleware.js";
import { hotelBookingSchema, ICreateHotelBooking, IHotelBookingResponse } from "../schemas/hotel.schema.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { toHotelResponse } from "./hotel.services.js";
import { toRoomTypeResponse } from "./roomType.services.js";
import { toUserResponse } from "./user.services.js";

//Hotel Booking Service

export const toHotelBookingResponse = (data: IHotelBookingDocument): IHotelBookingResponse => {
  return {
    id: (data._id as ObjectId).toString(),
    user: toUserResponse(data.user as IUserDocument),
    hotel: toHotelResponse(data.hotel as IHotelDocument),
    roomType: toRoomTypeResponse(data.roomType as IRoomTypeDocument),
    checkInDate: data.checkInDate,
    checkOutDate: data.checkOutDate,
    guests: {
      adults: data.guests.adults,
      children: data.guests.children,
    },
    totalPrice: data.totalPrice,
    status: data.status,
    paymentStatus: data.paymentStatus,
    bookingDate: data.bookingDate,
  };
};

export const createHotelBookingService = async (req: RequestWithUserAndBody<ICreateHotelBooking>): Promise<IHotelBookingResponse> => {
  if (!req.body) {
    throw new HttpError(400, "Request body not recieved in request");
  }

  const { hotel: hotelId, roomType: roomTypeId, checkInDate, checkOutDate, guests } = req.body;

  const [hotel, roomType] = await Promise.all([Hotel.findById(hotelId), RoomType.findById(roomTypeId)]);
  if (!hotel) {
    throw new HttpError(400, "Mentioned hotelId doesn't exist in db.");
  }

  if (!roomType) {
    throw new HttpError(400, "Mentioned roomTypeId doesn't exist in db");
  }

  if (!hotel.roomTypes.some((rt) => rt.toString() === roomTypeId)) {
    throw new HttpError(400, "Mentioned roomtype does not exist for the selected  hotel.");
  }

  const existiingBookings = await HotelBooking.find({
    roomType: roomType!._id,
    checkInDate: { $lt: new Date(checkOutDate) },
    checkOutDate: { $gt: new Date(checkInDate) },
  });

  const bookedCount = existiingBookings.length;
  const availableCount = roomType!.countInStock - bookedCount;

  if (availableCount <= 0) {
    throw new HttpError(400, "Cannot take any more booking in hotel.");
  }

  const nights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    throw new HttpError(400, "Check-out date must be after check-in date");
  }

  const totalPrice = roomType.pricePerNight * nights;

  const bookingData = {
    user: req.user?.id,
    hotel: hotelId,
    roomType: roomTypeId,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    guests: guests,
    totalPrice,
    status: "confirmed",
    paymentStatus: "paid",
    bookingDate: new Date(),
  };
  try {
    const validateBooking = await hotelBookingSchema.parseAsync(bookingData);
    const newBooking = new HotelBooking(validateBooking);

    await newBooking.save();
    const populatedBooking = await HotelBooking.findById(newBooking._id).populate(["user", "hotel", "roomType"]);

    if (!populatedBooking) {
      throw new HttpError(404, "Booking not found.");
    }
    return toHotelBookingResponse(populatedBooking);
  } catch (error) {
    console.error(error);
    throw new HttpError(400, "Input Validation Failed during hotel Booking", error);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Admin show all hotel booking
export const showAllHotelBookingService = async (): Promise<IHotelBookingResponse[]> => {
  const allHotelBookings = await HotelBooking.find({}).populate(["user", "roomType", "hotel"]);

  return allHotelBookings.map((booking) => toHotelBookingResponse(booking));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User hotel booking service

export const fetchAllUserHotelBookingService = async (req: RequestWithUser) => {
  const id = req?.user?.id;
  if (!id) {
    throw new HttpError(400, "UnAuthorized access.");
  }

  const allUserHotelBookings = await HotelBooking.find({ user: id }).populate(["user", "roomType", "hotel"]);

  if (allUserHotelBookings.length === 0) {
    return [];
  }
  return allUserHotelBookings.map((booking) => toHotelBookingResponse(booking));
};

export const fetchSpecificUserHotelBookingService = async (req: RequestWithUser) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new HttpError(404, "HotelId param not provided in request.");
  }

  // const hotelBooking = await HotelBooking.findById(bookingId).populate(["user", "roomType", "hotel"]);

  const hotelBooking = await HotelBooking.findOne({
    _id: bookingId,
    user: req.user?.id,
  }).populate(["user", "roomType", "hotel"]);

  if (!hotelBooking) {
    throw new HttpError(403, "You are not authorized to view this booking");
  }

  return toHotelBookingResponse(hotelBooking);
};

export const deleteSpecificUserHotelBookingService = async (req: RequestWithUser) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new HttpError(404, "BookinglId param not provided in request.");
  }

  const booking = await HotelBooking.findOneAndDelete({
    _id: bookingId,
    user: req.user?.id,
  }).populate(["user", "roomType", "hotel"]);

  if (!booking) {
    throw new HttpError(404, "Hotel Booking not found, unauthorized or  already deleted.");
  }

  return toHotelBookingResponse(booking);
};
