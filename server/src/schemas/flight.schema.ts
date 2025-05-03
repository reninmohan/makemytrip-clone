import mongoose from "mongoose";
import { z } from "zod";
import { capitalizeFirstLetter } from "../utils/capatilzeLetter.util.js";

/////////////////////////////////////////////////////////////////////////////////////////////
// Airline related schema

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

export const airlineSchema = z.object({
  name: z
    .string()
    .min(1, "Name of airline is required")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  code: z
    .string()
    .min(1, "Airline code is too short.")
    .max(10, "Airline code is too long")
    .transform((val) => val.trim())
    .transform((val) => val.toUpperCase()),
  logo: urlSchema,
});

export const createAirlineSchema = airlineSchema;

export const updateAirlineSchema = airlineSchema.partial();

export type IAirline = z.infer<typeof airlineSchema>;

export interface IAirlineResponse extends IAirline {
  id: string;
}
////////////////////////////////////////////////////////////////////////////////
// Airport related schema

export const airportSchema = z.object({
  name: z
    .string()
    .min(1, "Airport name is too short")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  code: z
    .string()
    .min(1, "Airport code is too short")
    .max(10, "Airport code is too long")
    .transform((val) => val.trim())
    .transform((val) => val.toUpperCase()),
  city: z
    .string()
    .min(1, "City name is too short.")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  country: z
    .string()
    .min(1, "Country name is too short.")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
});

export const createAirportSchema = airportSchema;
export const updateAirportSchema = airportSchema.partial();
export type IAirport = z.infer<typeof airportSchema>;

export interface IAirportResponse extends IAirport {
  id: string;
}

////////////////////////////////////////////////////////////////////////////////
//Flight related schema

const isValidObjectId = (value: string) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid ObjectId format",
});

const priceSchema = z.object({
  economy: z.coerce.number(),
  business: z.coerce.number(),
  firstClass: z.coerce.number(),
});

const seatSchema = z
  .object({
    economy: z.coerce.number(),
    business: z.coerce.number(),
    firstClass: z.coerce.number().default(0),
  })
  .refine((seats) => Object.values(seats).some((count) => count > 0), {
    message: "At least one seat must be available.",
  });

export const baseFlightSchema = z.object({
  flightNumber: z
    .string()
    .min(1, "Flightnumber is not short")
    .transform((val) => val.trim())
    .transform((val) => val.toUpperCase()),
  airline: objectIdSchema,
  departureAirport: objectIdSchema,
  arrivalAirport: objectIdSchema,
  departureTime: z.coerce.date(),
  arrivalTime: z.coerce.date(),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  price: priceSchema,
  availableSeats: seatSchema,
  isNonStop: z.coerce.boolean(),
});

export const flightSchema = baseFlightSchema
  .refine((data) => new Date(data.arrivalTime) > new Date(data.departureTime), {
    message: "Arrival time must be after departure time",
    path: ["arrivalTime"],
  })
  .refine((data) => data.departureAirport !== data.arrivalAirport, {
    message: "Departure and arrival airports must be different",
    path: ["arrivalAirport"],
  });

export const updateFlightSchema = baseFlightSchema
  .partial()
  .refine(
    (data) => {
      if (data.departureTime && data.arrivalTime) {
        return new Date(data.arrivalTime) > new Date(data.departureTime);
      }
      return true; // If one or both are missing, skip the refinement check
    },
    {
      message: "Arrival time must be after departure time",
      path: ["arrivalTime"],
    },
  )
  .refine((data) => data.departureAirport !== data.arrivalAirport, {
    message: "Departure and arrival airports must be different",
    path: ["arrivalAirport"],
  });

export const createFlightSchema = flightSchema;
export type IFlight = z.infer<typeof flightSchema>;
export interface IFlightResponse extends Omit<IFlight, "airline" | "departureAirport" | "arrivalAirport"> {
  id: string;
  airline: IAirline;
  departureAirport: IAirport;
  arrivalAirport: IAirport;
}

///////////////////////////////////////////////////////////////////////////////////////
// Flight booking related schema

export const flightBookingSchema = z.object({
  user: objectIdSchema,
  flight: objectIdSchema,
  seatClass: z.enum(["economy", "business", "firstClass"]).default("economy"),
  totalPrice: z
    .number({
      required_error: "Total price is required",
      invalid_type_error: "Total price must be a number",
    })
    .min(1, "Total price must be greater than 0"),
  status: z.enum(["pending", "confirmed", "cancelled"]).default("confirmed"),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).default("pending"),
  bookingDate: z.date().default(() => new Date()),
});

export const flightBookingRequestSchema = z.object({
  flight: objectIdSchema,
  seatClass: z.enum(["economy", "business", "firstClass"]).default("economy"),
});

export type ICreateFlightBooking = z.infer<typeof flightBookingRequestSchema>;

/////////////////////////////////////////////////////////////////////////////////////
// Fligth searching schema

export const searchFlightSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  airline: z.string().optional(),
  departureDate: z.string().optional(),
  returnDate: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  seatClass: z.enum(["economy", "business", "firstClass"]).optional(),
  isNonStop: z.enum(["true", "false"]).optional(),
  sort: z.enum(["price", "duration", "departureTime", "arrivalTime"]).optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});
