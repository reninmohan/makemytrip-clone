import mongoose, { Document } from "mongoose";
import { IAirline, IAirport, IFlight } from "../../schemas/flight.schema.js";

export interface IAirlineDocument extends IAirline, Document {
  _id: mongoose.Types.ObjectId;
}
// Airline Schema
const airlineMongooseSchema = new mongoose.Schema<IAirlineDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  logo: String,
});

export const Airline = mongoose.model<IAirlineDocument>("Airline", airlineMongooseSchema);

// Airport Schema

export interface IAirportDocument extends IAirport, Document {
  _id: mongoose.Types.ObjectId;
}

const airportMongooseSchema = new mongoose.Schema<IAirportDocument>({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

export const Airport = mongoose.model<IAirportDocument>("Airport", airportMongooseSchema);

// Flight Schema

export interface IFlightDocument extends Omit<IFlight, "airline" | "departureAirport" | "arrivalAirport">, Document {
  _id: mongoose.Types.ObjectId;
  airline: mongoose.Schema.Types.ObjectId | IAirlineDocument;
  departureAirport: mongoose.Schema.Types.ObjectId | IAirportDocument;
  arrivalAirport: mongoose.Schema.Types.ObjectId | IAirportDocument;
}

const flightMongooseSchema = new mongoose.Schema<IFlightDocument>({
  flightNumber: {
    type: String,
    required: true,
  },
  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airline",
    required: true,
  },
  departureAirport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airport",
    required: true,
  },
  arrivalAirport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airport",
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  price: {
    economy: {
      type: Number,
      required: true,
    },
    business: {
      type: Number,
      required: true,
    },
    firstClass: {
      type: Number,
    },
  },
  availableSeats: {
    economy: {
      type: Number,
      required: true,
    },
    business: {
      type: Number,
      required: true,
    },
    firstClass: {
      type: Number,
      default: 0,
    },
  },
  isNonStop: {
    type: Boolean,
    default: true,
  },
});

export const Flight = mongoose.model<IFlightDocument>("Flight", flightMongooseSchema);

// Flight Booking Schema
const flightBookingMongooseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  seatClass: {
    type: String,
    enum: ["economy", "business", "firstClass"],
    default: "economy",
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [1, "Total price must be greater than 0"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "confirmed",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

export const FlightBooking = mongoose.model("FlightBooking", flightBookingMongooseSchema);
