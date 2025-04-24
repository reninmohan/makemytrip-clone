import mongoose from "mongoose";
import { z } from "zod";

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
  name: z.string().min(1, "Name of airline is required").toLowerCase().trim(),
  code: z.string().min(1, "Airline code is too short.").max(5, "Airline code is too long").toUpperCase(),
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
  name: z.string().min(1, "Airport name is too short").trim().toLowerCase(),
  code: z.string().min(1, "Airport code is too short").max(5, "Airport code is too long").toUpperCase(),
  city: z.string().min(1, "City name is too short.").trim().toLowerCase(),
  country: z.string().min(1, "Country name is too short.").trim().toLowerCase(),
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
  flightNumber: z.string().min(1, "Flightnumber is not short").trim().toLowerCase(),
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

// const data: IFlight = {
//   flightNumber: "ABC123",
//   airline: "6809bd1ed067e58b4a8390d4",
//   departureAirport: "6809dac79cfbe77c0e763c1e",
//   arrivalAirport: "6809dee90dda94b43a63b544",
//   departureTime: new Date(2025 - 5 - 11),
//   arrivalTime: new Date(2025 - 5 - 12),
//   duration: 57,
//   price: {
//     economy: 10,
//     business: 15,
//     firstClass: 20,
//   },
//   availableSeats: {
//     economy: 10,
//     business: 10,
//     firstClass: 10,
//   },
//   isNonStop: true,
// };

///////////////////////////////////////////////////////////////////////////////////////
// Flight booking related schema
