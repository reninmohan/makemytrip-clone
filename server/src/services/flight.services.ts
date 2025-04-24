import { Request } from "express";
import { Airline, Airport, Flight, IAirlineDocument, IAirportDocument, IFlightDocument } from "../db/models/flight.model.js";
import { RequestWithUserAndBody } from "../middlewares/auth.middleware.js";
import { IAirline, IAirlineResponse, IAirport, IAirportResponse, IFlight, IFlightResponse } from "../schemas/flight.schema.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";

/////////////////////////////////////////////////////////////////////////////////////
// Airline related services

export const toAirlineResponse = (data: IAirlineDocument): IAirlineResponse => {
  return {
    id: data?._id.toString(),
    name: data?.name,
    code: data?.code,
    logo: data?.logo,
  };
};

export const createAirlineService = async (req: RequestWithUserAndBody<IAirline>): Promise<IAirlineResponse> => {
  if (!req.body) {
    throw new HttpError(400, "Request body is missing. Please provide airline details");
  }
  if (!req.body.logo) {
    throw new HttpError(400, "Logo image is required in 'logo' field of request body.");
  }
  const airline = new Airline({ ...req.body });
  try {
    await airline.save();
    return toAirlineResponse(airline);
  } catch (error) {
    throw new HttpError(500, "Unable to create new airline in db.", error);
  }
};

export const updateAirlineService = async (req: RequestWithUserAndBody<Partial<IAirline>>): Promise<IAirlineResponse> => {
  const { airlineId } = req.params;
  if (!airlineId) {
    throw new HttpError(400, "AirlineId not received in params required for airline update.");
  }
  if (!req.body) {
    throw new HttpError(400, "Request body is missing. Please provide airline  details");
  }
  const airline = await Airline.findById(airlineId);
  if (!airline) {
    throw new HttpError(404, "Mentioned airlineId doesn't exist in db.");
  }
  Object.assign(airline, req.body);
  try {
    await airline.save();
    return toAirlineResponse(airline);
  } catch (error) {
    throw new HttpError(500, "Unable to update airline details in db.", error);
  }
};

export const deleteAirlineService = async (req: Request): Promise<IAirlineResponse> => {
  const { airlineId } = req.params;
  if (!airlineId) {
    throw new HttpError(400, "AirlineId not received in params required for airline deletion.");
  }
  const airline = await Airline.findByIdAndDelete(airlineId);
  if (!airline) {
    throw new HttpError(404, "Mentioned airlineId doesn't exist in db or already deleted.");
  }
  return toAirlineResponse(airline);
};

export const showAllAirlinesService = async (): Promise<IAirlineResponse[]> => {
  const airline = await Airline.find({});

  if (airline.length === 0) {
    throw new HttpError(404, "Failed to fetch all airline details from db.");
  }
  return airline.map((airline) => toAirlineResponse(airline));
};

//////////////////////////////////////////////////////////////////////////////////
// Airport related controller

export const toAirportResponse = (data: IAirportDocument): IAirportResponse => {
  return {
    id: data?._id.toString(),
    name: data?.name,
    code: data?.code,
    city: data?.city,
    country: data?.country,
  };
};

export const createAirportService = async (req: RequestWithUserAndBody<IAirport>): Promise<IAirportResponse> => {
  if (!req.body) {
    throw new HttpError(400, "Request body is missing. Please provide airport details");
  }
  const airport = new Airport({ ...req.body });
  try {
    await airport.save();
    return toAirportResponse(airport);
  } catch (error) {
    throw new HttpError(500, "Unable to create new airport  in db.", error);
  }
};

export const updateAirportService = async (req: RequestWithUserAndBody<Partial<IAirport>>): Promise<IAirportResponse> => {
  const { airportId } = req.params;
  if (!airportId) {
    throw new HttpError(400, "airportId not received in params required for airport update.");
  }
  if (!req.body) {
    throw new HttpError(400, "Request body is missing. Please provide airport  details");
  }
  const airport = await Airport.findById(airportId);
  if (!airport) {
    throw new HttpError(404, "Mentioned airportId doesn't exist in db.");
  }
  Object.assign(airport, req.body);
  try {
    await airport.save();
    return toAirportResponse(airport);
  } catch (error) {
    throw new HttpError(500, "Unable to update airport details in db.", error);
  }
};

export const deleteAirportService = async (req: Request): Promise<IAirportResponse> => {
  const { airportId } = req.params;
  if (!airportId) {
    throw new HttpError(400, "airportId not received in params required for airport deletion.");
  }
  const airport = await Airport.findByIdAndDelete(airportId);
  if (!airport) {
    throw new HttpError(404, "Mentioned airportId doesn't exist in db or already deleted.");
  }
  return toAirportResponse(airport);
};

export const showAllAirportService = async (): Promise<IAirportResponse[]> => {
  const airports = await Airport.find({});

  if (airports.length === 0) {
    throw new HttpError(404, "Failed to fetch all airport details from db.");
  }
  return airports.map((airport) => toAirportResponse(airport));
};

//////////////////////////////////////////////////////////////////////////////////
// Flight related controller

export const toFlightResponse = (data: IFlightDocument): IFlightResponse => {
  return {
    id: data?._id.toString(),
    flightNumber: data?.flightNumber,
    airline: toAirlineResponse(data?.airline as IAirlineDocument),
    departureAirport: toAirportResponse(data?.departureAirport as IAirportDocument),
    arrivalAirport: toAirportResponse(data?.arrivalAirport as IAirportDocument),
    departureTime: data?.departureTime,
    arrivalTime: data?.arrivalTime,
    duration: data?.duration,
    price: data?.price,
    availableSeats: data?.availableSeats,
    isNonStop: data?.isNonStop,
  };
};

export const createFlightService = async (req: RequestWithUserAndBody<IFlight>): Promise<IFlightResponse> => {
  if (!req.body) {
    throw new HttpError(400, "Request body is missing. Please provide flight details");
  }
  const flight = new Flight({ ...req.body });
  try {
    await flight.save();
    return toFlightResponse(flight);
  } catch (error) {
    throw new HttpError(500, "Unable to create new flight  in db.", error);
  }
};

export const updateFlightService = async (req: RequestWithUserAndBody<Partial<IFlight>>): Promise<IFlightResponse> => {
  const { flightId } = req.params;
  if (!flightId) {
    throw new HttpError(400, "flightId not received in params required for flight update.");
  }
  if (!req.body) {
    throw new HttpError(400, "Request body is missing. Please provide flight details");
  }
  const flight = await Flight.findById(flightId);
  if (!flight) {
    throw new HttpError(404, "Mentioned flightId doesn't exist in db.");
  }
  Object.assign(flight, req.body);
  try {
    await flight.save();
    return toFlightResponse(flight);
  } catch (error) {
    throw new HttpError(500, "Unable to update flight details in db.", error);
  }
};

export const deleteFlightService = async (req: Request): Promise<IFlightResponse> => {
  const { flightId } = req.params;
  if (!flightId) {
    throw new HttpError(400, "flightId not received in params required for flight deletion.");
  }
  const flight = await Flight.findByIdAndDelete(flightId);
  if (!flight) {
    throw new HttpError(404, "Mentioned flightId doesn't exist in db or already deleted.");
  }
  return toFlightResponse(flight);
};

export const showAllFlightService = async (): Promise<IFlightResponse[]> => {
  const flights = await Flight.find({}).populate(["airline", "departureAirport", "arrivalAirport"]);

  if (flights.length === 0) {
    throw new HttpError(404, "Failed to fetch all flight details from db.");
  }
  return flights.map((flight) => toFlightResponse(flight));
};

/////////////////////////////////////////////////////////////////////////////////////////////
// Flight search related for user

export const filterAndSearchAllFlightsService = async (req: Request): Promise<{ flights: IFlightResponse[]; totalFlights: number; totalPages: number }> => {
  const { airline, from, to, nonstop, date, limit = "10" } = req.query;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {};

  if (airline) query["airline"] = airline;
  if (from) query["departureAirport"] = from;
  if (to) query["arrivalAirport"] = to;
  if (nonstop === "true") query["isNonStop"] = true;
  if (date) {
    const start = new Date(date as string);
    const end = new Date(date as string);
    end.setDate(end.getDate() + 1);
    query["departureTime"] = { $gte: start, $lt: end };
  }

  const flights = await Flight.find(query).populate(["airline", "departureAirport", "arrivalAirport"]);

  const totalFlights = flights.length;
  const totalPages = Math.ceil(totalFlights / Number(limit));

  return {
    flights: flights.map((flight) => toFlightResponse(flight)),
    totalFlights,
    totalPages,
  };
  /*

  const totalFlights = flights.length;

  if (!flights || flights.length === 0) {
    return {
      flights: [],
      totalFlights: 0,
      totalPages: 0,
      currentPage: Number(page),
    };
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
  */
};
