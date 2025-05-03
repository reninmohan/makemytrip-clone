import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { RequestWithUserAndBody } from "../middlewares/auth.middleware.js";
import { IAirline, IAirport, IFlight } from "../schemas/flight.schema.js";
import {
  createAirlineService,
  createAirportService,
  createFlightService,
  deleteAirlineService,
  deleteAirportService,
  deleteFlightService,
  filterAndSearchAllFlightsService,
  getAirlinesService,
  getAirportService,
  getAllAirportService,
  getAllFlightService,
  getFlightService,
  showAllAirlinesService,
  updateAirlineService,
  updateAirportService,
  updateFlightService,
} from "../services/flight.services.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Airline related controller

export const createAirline = async (req: RequestWithUserAndBody<IAirline>, res: Response, next: NextFunction) => {
  try {
    const airline = await createAirlineService(req);
    return res.status(201).json(new ApiResponse(true, "Airline created successfully.", airline));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to create new airline"));
  }
};

export const updateAirline = async (req: RequestWithUserAndBody<Partial<IAirline>>, res: Response, next: NextFunction) => {
  try {
    const airline = await updateAirlineService(req);
    return res.status(200).json(new ApiResponse(true, "Airline details updated successfully.", airline));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to update airline details."));
  }
};

export const deleteAirline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const airline = await deleteAirlineService(req);
    return res.status(200).json(new ApiResponse(true, "Airline details deleted  successfully.", airline));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to delete  airline details."));
  }
};

export const showAllAirlines = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const airline = await showAllAirlinesService();
    return res.status(200).json(new ApiResponse(true, "Fetched details of all airline successfully.", airline));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch details of all  airlines."));
  }
};

export const getAirlines = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const airline = await getAirlinesService(req);
    return res.status(200).json(new ApiResponse(true, "Fetched details of  airline successfully.", airline));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch details of   airlines."));
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Airport related controller

export const createAirport = async (req: RequestWithUserAndBody<IAirport>, res: Response, next: NextFunction) => {
  try {
    const airport = await createAirportService(req);
    return res.status(201).json(new ApiResponse(true, "New Airport created successfully.", airport));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to create new Airport"));
  }
};

export const updateAirport = async (req: RequestWithUserAndBody<IAirport>, res: Response, next: NextFunction) => {
  try {
    const airport = await updateAirportService(req);
    return res.status(200).json(new ApiResponse(true, "Airport details updated successfully.", airport));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to update Airport details"));
  }
};

export const deleteAirport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const airport = await deleteAirportService(req);
    return res.status(200).json(new ApiResponse(true, "Airport details  deleted  successfully.", airport));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to delete airport details."));
  }
};

export const getAirport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const airport = await getAirportService(req);
    return res.status(200).json(new ApiResponse(true, "Fetched details of  airport  successfully.", airport));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch details of  airport."));
  }
};

export const getAllAirport = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const airport = await getAllAirportService();
    return res.status(200).json(new ApiResponse(true, "Fetched details of all airport  successfully.", airport));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch details of all airport."));
  }
};

/////////////////////////////////////////////////////////////////////////////////////////
// Flight related controller

export const createFlight = async (req: RequestWithUserAndBody<IFlight>, res: Response, next: NextFunction) => {
  try {
    const flight = await createFlightService(req);
    return res.status(201).json(new ApiResponse(true, "New flight created successfully.", flight));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to create new flight"));
  }
};

export const updateFlight = async (req: RequestWithUserAndBody<Partial<IFlight>>, res: Response, next: NextFunction) => {
  try {
    const flight = await updateFlightService(req);
    return res.status(200).json(new ApiResponse(true, "Flight  details updated successfully.", flight));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to update Flight details"));
  }
};

export const deleteFlight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flight = await deleteFlightService(req);
    return res.status(200).json(new ApiResponse(true, "Flight  details deleted successfully.", flight));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to delete Flight details"));
  }
};

export const getAllFlights = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const flight = await getAllFlightService();
    return res.status(200).json(new ApiResponse(true, "Fetched details of all flight  successfully.", flight));
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch details of all flight."));
  }
};

export const getFlight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flight = await getFlightService(req);
    return res.status(200).json(new ApiResponse(true, "Fetched details of all flight  successfully.", flight));
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch details of all flight."));
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////
// Flight search for user

export const filterAndSearchAllFlights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flights = await filterAndSearchAllFlightsService(req);
    return res.status(200).json(new ApiResponse(true, "Fetch All  Flight details successfully.", flights));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all flight details.", error));
  }
};
