import mongoose from "mongoose";
import { z } from "zod";
import { IUserResponse } from "../types/user.types.js";

// helper function for schema
const isValidObjectId = (value: string) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid ObjectId format",
});

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const urlSchema = z.string().refine(isValidUrl, {
  message: "Invalid URL format",
});
///////////////////////////////////////////////////////////////////////////////////////////////

//Hotel related schema
const coordinatesSchema = z
  .object({
    latitude: z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
    longitude: z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  })
  .partial();

const hotelLocationSchema = z.object({
  city: z.string().min(3, "City name is required.").max(30, "City name cannot exceed 30 characters").trim(),
  state: z.string().min(3, "State name is required.").max(30, "State name cannot exceed 30 characters").trim(),
  country: z.string().min(3, "Country name is required.").max(30, "Country name cannot exceed 30 characters").trim(),
  address: z.string().max(500, "Address cannot exceed 500 characters").optional(),
  coordinates: coordinatesSchema,
});

export const hotelSchema = z.object({
  name: z.string().min(5, "Hotel name is required.").trim(),
  description: z.string().min(10, "Description must be at least 10 characters long.").max(1000, "Description cannot exceed 1000 characters.").trim(),
  location: hotelLocationSchema,
  images: z.array(urlSchema).min(1, "At least one image is required.").max(6, "Cannot have more than 6 images."),
  rating: z.coerce.number().min(1).max(5).default(1),
  amenities: z.array(z.string().trim()).min(1, "At least one amenity is required.").max(20, "Cannot have more than 20 amenities."),
  roomTypes: z.array(objectIdSchema).default([]),
});

export type IHotel = z.infer<typeof hotelSchema>;

export interface IHotelResponse extends Omit<IHotel, "roomTypes"> {
  id: string;
  roomTypes: (IRoomType & { id: string })[];
}

//For roomtype create validation
export const createHotelSchema = hotelSchema.omit({
  roomTypes: true,
  rating: true,
});

//For roomtype update validation
export const updateHotelSchema = hotelSchema.partial();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Roomtype related schema

export const roomTypeSchema = z.object({
  name: z.string().min(1, "Room name is required.").trim(),
  hotel: objectIdSchema,
  description: z.string().min(10, "Description must be at least 10 characters long.").max(1000, "Description cannot exceed 1000 characters.").trim(),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
  pricePerNight: z.coerce.number().positive("Price must be greater than 0.").max(100000, "Price cannot exceed 100,000 per night."),
  amenities: z.array(z.string().trim()).min(1, "At least one amenity is required.").max(15, "Cannot have more than 15 amenities."),
  images: z.array(urlSchema).min(1, "At least one image is required.").max(6, "Cannot have more than 6 images."),
  bedType: z.string().min(1, "1 Bed Type is required."),
  countInStock: z.coerce.number(),
});

export const createRoomTypeSchema = roomTypeSchema;

export type IRoomType = z.infer<typeof roomTypeSchema>;

export interface IRoomTypeResponse extends Omit<IRoomType, "hotel"> {
  id: string;
  hotel: string;
}

export const updateRoomTypeSchema = roomTypeSchema.partial();

////////////////////////////////////////////////////////////////////////////////////////////////

// Hotel booking related schema

const guestSchema = z.object({
  adults: z.coerce.number().min(1, "At least one adult is required."),
  children: z.coerce.number().min(0).default(0),
});

export const hotelBookingSchema = z
  .object({
    user: objectIdSchema,
    hotel: objectIdSchema,
    roomType: objectIdSchema,
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    guests: guestSchema,
    totalPrice: z.coerce.number().positive("Total price must be greater than 0"),
    status: z.enum(["pending", "confirmed", "cancelled", "completed"]).default("pending"),
    paymentStatus: z.enum(["pending", "paid", "refunded"]).default("pending"),
    bookingDate: z.coerce.date().default(() => new Date()),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, { message: "Check-out date must be after check-in date.", path: ["checkOutDate"] });

export type IHotelBooking = z.infer<typeof hotelBookingSchema>;

export const createHotelBookingSchema = z
  .object({
    hotel: objectIdSchema,
    roomType: objectIdSchema,
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    guests: guestSchema,
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after the check-in date",
    path: ["checkOutDate"],
  });

export type ICreateHotelBooking = z.infer<typeof createHotelBookingSchema>;

export interface IHotelBookingResponse {
  id: string;
  user: IUserResponse;
  hotel: IHotelResponse;
  roomType: IRoomTypeResponse;
  checkInDate: Date;
  checkOutDate: Date;
  guests: {
    adults: number;
    children: number;
  };
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  bookingDate: Date;
}

//Used for input validation only no DB required.
export const hotelSearchParamsSchema = z
  .object({
    city: z.string().max(100, "City name cannot exceed 100 characters").optional(),
    country: z.string().max(100, "Country name cannot exceed 100 characters").optional(),
    state: z.string().max(100, "State name cannot exceed 100 characters").optional(),
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    guests: guestSchema,
    priceRange: z
      .object({
        min: z.coerce.number().min(0, "Minimum price cannot be negative").optional(),
        max: z.coerce.number().positive("Maximum price must be greater than 0").max(100000, "Maximum price cannot exceed 100,000").optional(),
      })
      .refine((data) => !data.min || !data.max || data.min <= data.max, "Minimum price must be less than or equal to maximum price")
      .optional(),
    amenities: z.array(z.string()).max(20, "Cannot search for more than 20 amenities").optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date.",
    path: ["checkOutDate"],
  });
