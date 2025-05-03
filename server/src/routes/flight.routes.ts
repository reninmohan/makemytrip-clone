import express from "express";

import { filterAndSearchAllFlights, getFlight } from "../controllers/flight.controller.js";

const flightRouter = express.Router();

//For gettting all available flights (with filters like source, destination,date)
flightRouter.get("/search", filterAndSearchAllFlights);

//Get full details of a specific flight
flightRouter.get("/:flightId", getFlight);

export default flightRouter;
