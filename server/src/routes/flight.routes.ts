import express from "express";

import { filterAndSearchAllFlightsService } from "../services/flight.services.js";
import { getFlight } from "../controllers/flight.controller.js";

const flightRouter = express.Router();

//For gettting all available flights (with filters like source, destination,date)
flightRouter.get("/search", filterAndSearchAllFlightsService);

//Get full details of a specific flight
flightRouter.get("/:flightId", getFlight);

export default flightRouter;
