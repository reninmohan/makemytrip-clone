import mongoose from "mongoose";
import { z } from "zod";

const isValidObjectId = (value: string) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid ObjectId format",
});

const coordinatesSchema = z
  .object({
    latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
    longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  })
  .optional();

const hotelLocationSchema = z.object({
  city: z.string().min(1, "City name is required.").max(100, "City name cannot exceed 100 characters").trim(),
  state: z.string().min(1, "State name is required.").max(100, "State name cannot exceed 100 characters").trim(),
  country: z.string().min(1, "Country name is required.").max(100, "Country name cannot exceed 100 characters").trim(),
  address: z.string().max(500, "Address cannot exceed 500 characters").optional(),
  coordinates: coordinatesSchema,
});

const guestSchema = z.object({
  adults: z.number().min(1, "At least one adult is required."),
  children: z.number().min(0).default(0),
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

export const roomTypeSchema = z.object({
  hotel: objectIdSchema,
  name: z.string().min(1, "Room name is required.").trim(),
  description: z.string().min(10, "Description must be at least 10 characters long.").max(1000, "Description cannot exceed 1000 characters.").trim().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1."),
  pricePerNight: z.number().positive("Price must be greater than 0.").max(100000, "Price cannot exceed 100,000 per night."),
  amenities: z.array(z.string()).min(1, "At least one amenity is required.").max(15, "Cannot have more than 15 amenities."),
  images: z.array(urlSchema).min(1, "At least one image is required.").max(5, "Cannot have more than 5 images."),
  available: z.boolean().default(true),
});

export const hotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required.").trim(),
  description: z.string().min(10, "Description must be at least 10 characters long.").max(2000, "Description cannot exceed 2000 characters.").trim(),
  location: hotelLocationSchema,
  images: z.array(urlSchema).min(1, "At least one image is required.").max(10, "Cannot have more than 10 images."),
  rating: z.number().min(0).max(5).default(0).optional(),
  amenities: z.array(z.string()).min(1, "At least one amenity is required.").max(20, "Cannot have more than 20 amenities."),
  pricePerNight: z.number().positive("Price must be greater than 0.").max(100000, "Price cannot exceed 100,000 per night."),
  roomTypes: z
    .array(z.union([objectIdSchema, roomTypeSchema]))
    .optional()
    .default([]),
});

export const hotelBookingSchema = z
  .object({
    user: objectIdSchema,
    hotel: objectIdSchema,
    roomType: objectIdSchema,
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    //   checkInDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid check-in date format." }),
    //   checkOutDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid check-out date format." }),
    guests: guestSchema,
    totalPrice: z.number().positive("Total price must be greater than 0"),
    status: z.enum(["pending", "confirmed", "cancelled", "completed"]).default("pending"),
    paymentStatus: z.enum(["pending", "paid", "refunded"]).default("pending"),
    bookingDate: z.coerce.date().default(() => new Date()),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, { message: "Check-out date must be after check-in date.", path: ["checkOutDate"] });

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
        min: z.number().min(0, "Minimum price cannot be negative").optional(),
        max: z.number().positive("Maximum price must be greater than 0").max(100000, "Maximum price cannot exceed 100,000").optional(),
      })
      .refine((data) => !data.min || !data.max || data.min <= data.max, "Minimum price must be less than or equal to maximum price")
      .optional(),
    amenities: z.array(z.string()).max(20, "Cannot search for more than 20 amenities").optional(),
    rating: z.number().min(0).max(5).optional(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date.",
    path: ["checkOutDate"],
  });

export const createHotelSchema = hotelSchema.omit({
  rating: true,
  roomTypes: true,
});
