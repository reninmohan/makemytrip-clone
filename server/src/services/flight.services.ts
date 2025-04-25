/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { Airline, Airport, Flight, IAirlineDocument, IAirportDocument, IFlightDocument } from "../db/models/flight.model.js";
import { RequestWithUserAndBody } from "../middlewares/auth.middleware.js";
import { IAirline, IAirlineResponse, IAirport, IAirportResponse, IFlight, IFlightResponse, searchFlightSchema } from "../schemas/flight.schema.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import mongoose from "mongoose";
import { capitalizeFirstLetter } from "../utils/capatilzeLetter.util.js";

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
/*

export const filterAndSearchAllFlightsService = async (req: Request): Promise<{ flights: IFlightResponse[]; totalFlights: number; totalPages: number }> => {
  const { airline, from, to, nonstop, date, seatClass, limit = "10" } = req.query;

  if (!from || !to) {
    throw new HttpError(400, "Both 'from' and 'to' query parameters are required.");
  }

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
  */
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
// };

/////////////////////////////////////////////////////////////////////////////////////////////////

// Flight search related service

export const filterAndSearchAllFlightsService = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const validationResult = searchFlightSchema.safeParse(req.query);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid search parameters",
        errors: validationResult.error.errors,
      });
    }

    const { from, to, airline, departureDate, minPrice, maxPrice, seatClass, isNonStop, sort, order, page, limit } = validationResult.data;

    // Build filter query
    const query: any = {};

    // Airport filters (using ObjectId if valid, otherwise try to find by airport code)
    if (from) {
      if (mongoose.Types.ObjectId.isValid(from)) {
        query.departureAirport = from;
      } else {
        const airportLookup = await Airport.findOne({ name: capitalizeFirstLetter(from) });
        if (airportLookup) {
          query.departureAirport = airportLookup._id;
        } else {
          return res.status(404).json({ success: false, message: "Departure airport not found" });
        }
      }
    }

    if (to) {
      if (mongoose.Types.ObjectId.isValid(to)) {
        query.arrivalAirport = to;
      } else {
        const airportLookup = await Airport.findOne({ name: to.toUpperCase() });
        if (airportLookup) {
          query.arrivalAirport = airportLookup._id;
        } else {
          return res.status(404).json({ success: false, message: "Arrival airport not found" });
        }
      }
    }

    // Airline filter
    if (airline) {
      if (mongoose.Types.ObjectId.isValid(airline)) {
        query.airline = airline;
      } else {
        const airlineLookup = await mongoose.model("Airline").findOne({
          $or: [{ name: { $regex: airline, $options: "i" } }, { code: airline.toUpperCase() }],
        });
        if (airlineLookup) {
          query.airline = airlineLookup._id;
        } else {
          return res.status(404).json({ success: false, message: "Airline not found" });
        }
      }
    }

    // Date filter
    if (departureDate) {
      const startDate = new Date(departureDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(departureDate);
      endDate.setHours(23, 59, 59, 999);

      query.departureTime = { $gte: startDate, $lte: endDate };
    }

    // Price filter - Check if seats are available in the selected class
    if (seatClass) {
      query[`availableSeats.${seatClass}`] = { $gt: 0 };

      if (minPrice !== undefined) {
        query[`price.${seatClass}`] = { $gte: minPrice };
      }

      if (maxPrice !== undefined) {
        if (query[`price.${seatClass}`]) {
          query[`price.${seatClass}`].$lte = maxPrice;
        } else {
          query[`price.${seatClass}`] = { $lte: maxPrice };
        }
      }
    } else {
      // If no class is specified, filter by any class pricing
      if (minPrice !== undefined || maxPrice !== undefined) {
        const priceQuery: any = {};
        if (minPrice !== undefined) {
          priceQuery.$or = [{ "price.economy": { $gte: minPrice } }, { "price.business": { $gte: minPrice } }, { "price.firstClass": { $gte: minPrice } }];
        }

        if (maxPrice !== undefined) {
          priceQuery.$or = [{ "price.economy": { $lte: maxPrice } }, { "price.business": { $lte: maxPrice } }, { "price.firstClass": { $lte: maxPrice } }];
        }

        Object.assign(query, priceQuery);
      }
    }

    // Non-stop filter
    if (isNonStop) {
      query.isNonStop = isNonStop === "true";
    }

    // Build sort query
    let sortQuery: any = {};

    if (sort) {
      const sortDirection = order === "asc" ? 1 : -1;

      switch (sort) {
        case "price":
          // Sort by the requested class, or lowest price if no class specified
          if (seatClass) {
            sortQuery[`price.${seatClass}`] = sortDirection;
          } else {
            // Sort by lowest price across all classes
            sortQuery["price.economy"] = sortDirection;
          }
          break;
        case "duration":
          sortQuery.duration = sortDirection;
          break;
        case "departureTime":
          sortQuery.departureTime = sortDirection;
          break;
        case "arrivalTime":
          sortQuery.arrivalTime = sortDirection;
          break;
        default:
          // Default sort by departure time
          sortQuery.departureTime = 1;
      }
    } else {
      // Default sort by departure time
      sortQuery.departureTime = 1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with population
    const flights = await Flight.find(query).populate("airline", "name code logo").populate("departureAirport", "name code city country").populate("arrivalAirport", "name code city country").sort(sortQuery).skip(skip).limit(limit);

    // Get total count for pagination
    const totalFlights = await Flight.countDocuments(query);
    const totalPages = Math.ceil(totalFlights / limit);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalFlights,
      resultsPerPage: limit,
      data: flights.map((flight) => ({
        id: flight._id,
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        departureAirport: flight.departureAirport,
        arrivalAirport: flight.arrivalAirport,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        duration: flight.duration,
        price: flight.price,
        availableSeats: flight.availableSeats,
        isNonStop: flight.isNonStop,
      })),
    });
  } catch (error) {
    console.error("Search flights error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching for flights",
      error: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
    });
  }
};
