/* eslint-disable @typescript-eslint/no-explicit-any */
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
    return [];
  }
  return airline.map((airline) => toAirlineResponse(airline));
};

export const getAirlinesService = async (req: Request): Promise<IAirlineResponse> => {
  const { airlineId } = req.params;
  const airline = await Airline.findById(airlineId);

  if (!airline) {
    throw new HttpError(404, "Airline not found in db.");
  }
  return toAirlineResponse(airline);
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

export const getAllAirportService = async (): Promise<IAirportResponse[]> => {
  const airports = await Airport.find({});

  if (airports.length === 0) {
    return [];
  }
  return airports.map((airport) => toAirportResponse(airport));
};

export const getAirportService = async (req: Request): Promise<IAirportResponse> => {
  const { airportId } = req.params;

  const airport = await Airport.findById(airportId);

  if (!airport) {
    throw new HttpError(404, "Mentioned airport detail not found in db.");
  }
  return toAirportResponse(airport);
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

export const getAllFlightService = async (): Promise<IFlightResponse[]> => {
  const flights = await Flight.find({}).populate(["airline", "departureAirport", "arrivalAirport"]);

  if (flights.length === 0) {
    return [];
  }
  return flights.map((flight) => toFlightResponse(flight));
};

export const getFlightService = async (req: Request): Promise<IFlightResponse> => {
  const { flightId } = req.params;
  const flight = await Flight.findById(flightId).populate(["airline", "departureAirport", "arrivalAirport"]);

  if (!flight) {
    throw new HttpError(404, "Mentioned flightId doesn't exist in db or already deleted.");
  }

  return toFlightResponse(flight);
};
/////////////////////////////////////////////////////////////////////////////////////////////

export const filterAndSearchAllFlightsService = async (req: Request) => {
  const { from, to, departDate, arrivalTimeRange, departTimeRange, minPrice, maxPrice, seatClass, isNonStop, airline } = req.query;

  const departTimeRanges = Array.isArray(departTimeRange) ? departTimeRange : departTimeRange ? [departTimeRange] : [];
  const arrivalTimeRanges = Array.isArray(arrivalTimeRange) ? arrivalTimeRange : arrivalTimeRange ? [arrivalTimeRange] : [];
  const airlineValues = Array.isArray(airline) ? airline : airline ? [airline] : [];

  let departureAirportIds: any[] = [];

  if (from) {
    const departureAirports = await Airport.find({
      $or: [{ city: { $regex: new RegExp(from as string, "i") } }, { country: { $regex: new RegExp(from as string, "i") } }, { name: { $regex: new RegExp(from as string, "i") } }],
    }).select("_id");

    departureAirportIds = departureAirports.map((airport) => airport._id);

    if (departureAirportIds.length === 0) {
      return { count: 0, flights: [] };
    }
  }

  let arrivalAirportIds: any[] = [];

  if (to) {
    const arrivalAirports = await Airport.find({
      $or: [{ city: { $regex: new RegExp(to as string, "i") } }, { country: { $regex: new RegExp(to as string, "i") } }, { name: { $regex: new RegExp(to as string, "i") } }],
    }).select("_id");

    arrivalAirportIds = arrivalAirports.map((airport) => airport._id);

    if (arrivalAirportIds.length === 0) {
      return { count: 0, flights: [] };
    }
  }

  const query: Record<string, any> = {};

  if (departureAirportIds.length > 0) {
    query.departureAirport = { $in: departureAirportIds };
  }

  if (arrivalAirportIds.length > 0) {
    query.arrivalAirport = { $in: arrivalAirportIds };
  }

  if (airlineValues.length > 0) {
    const airlineRegexes = airlineValues.map((val) => ({
      $or: [{ name: { $regex: new RegExp(val as string, "i") } }, { code: { $regex: new RegExp(val as string, "i") } }],
    }));

    const airlines = await Airline.find({ $or: airlineRegexes }).select("_id");
    const airlineIds = airlines.map((a) => a._id);

    if (airlineIds.length === 0) {
      return { count: 0, flights: [] };
    }

    query.airline = { $in: airlineIds };
  }

  if (departDate && typeof departDate === "string") {
    const date = new Date(departDate);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    query.departureTime = { $gte: startOfDay, $lte: endOfDay };
  }

  // Handle departure time range filtering
  if (departTimeRanges.length > 0) {
    // Get user's timezone offset in hours
    const timezoneOffset = new Date().getTimezoneOffset() / 60;

    const departTimeConditions = departTimeRanges
      .map((range) => {
        switch (range) {
          case "before6am":
            return { $lt: [{ $add: [{ $hour: "$departureTime" }, -timezoneOffset] }, 6] };
          case "6amTo12pm":
            return {
              $and: [{ $gte: [{ $add: [{ $hour: "$departureTime" }, -timezoneOffset] }, 6] }, { $lt: [{ $add: [{ $hour: "$departureTime" }, -timezoneOffset] }, 12] }],
            };
          case "12pmTo6pm":
            return {
              $and: [{ $gte: [{ $add: [{ $hour: "$departureTime" }, -timezoneOffset] }, 12] }, { $lt: [{ $add: [{ $hour: "$departureTime" }, -timezoneOffset] }, 18] }],
            };
          case "after6pm":
            return { $gte: [{ $add: [{ $hour: "$departureTime" }, -timezoneOffset] }, 18] };
          default:
            return null;
        }
      })
      .filter(Boolean);

    if (departTimeConditions.length > 0) {
      query.$and = query.$and || [];
      query.$and.push({
        $expr: { $or: departTimeConditions },
      });
    }
  }

  // Handle arrival time range filtering
  if (arrivalTimeRanges.length > 0) {
    const timezoneOffset = new Date().getTimezoneOffset() / 60;

    const arrivalTimeConditions = arrivalTimeRanges
      .map((range) => {
        switch (range) {
          case "before6am":
            return {
              $lt: [{ $add: [{ $hour: "$arrivalTime" }, -timezoneOffset] }, 6],
            };
          case "6amTo12pm":
            return {
              $and: [{ $gte: [{ $add: [{ $hour: "$arrivalTime" }, -timezoneOffset] }, 6] }, { $lt: [{ $add: [{ $hour: "$arrivalTime" }, -timezoneOffset] }, 12] }],
            };
          case "12pmTo6pm":
            return {
              $and: [{ $gte: [{ $add: [{ $hour: "$arrivalTime" }, -timezoneOffset] }, 12] }, { $lt: [{ $add: [{ $hour: "$arrivalTime" }, -timezoneOffset] }, 18] }],
            };
          case "after6pm":
            return {
              $gte: [{ $add: [{ $hour: "$arrivalTime" }, -timezoneOffset] }, 18],
            };
          default:
            return null;
        }
      })
      .filter(Boolean);

    if (arrivalTimeConditions.length > 0) {
      query.$and = query.$and || [];
      query.$and.push({
        $expr: { $or: arrivalTimeConditions },
      });
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceSchema = await Flight.findOne().select("price");
    if (priceSchema && typeof priceSchema.price === "object") {
      if (seatClass) {
        query[`price.${seatClass}`] = {};
        if (minPrice !== undefined) query[`price.${seatClass}`].$gte = Number(minPrice);
        if (maxPrice !== undefined) query[`price.${seatClass}`].$lte = Number(maxPrice);
      } else {
        query["price.economy"] = {};
        if (minPrice !== undefined) query["price.economy"].$gte = Number(minPrice);
        if (maxPrice !== undefined) query["price.economy"].$lte = Number(maxPrice);
      }
    } else {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }
  }

  if (isNonStop !== undefined) {
    query.isNonStop = typeof isNonStop === "string" ? isNonStop === "true" : Boolean(isNonStop);
  }

  if (seatClass) {
    query[`availableSeats.${seatClass}`] = { $gt: 0 };
  }

  const flights = await Flight.find(query).populate({ path: "airline", select: "name code logo" }).populate({ path: "departureAirport", select: "name code city country" }).populate({ path: "arrivalAirport", select: "name code city country" }).lean();

  const formattedFlights = flights.map(({ _id, ...rest }) => ({
    id: _id,
    ...rest,
  }));

  return {
    count: formattedFlights.length,
    flights: formattedFlights,
  };
};
