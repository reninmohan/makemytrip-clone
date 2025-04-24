import express from "express";
import { filterAndSearchAllFlights } from "../controllers/flight.controller.js";

const flightRouter = express.Router();

//For gettting all available flights (with filters like source, destination,date)
flightRouter.get("/search", filterAndSearchAllFlights);

//Get full details of a specific flight
flightRouter.get("/:flightId");

export default flightRouter;
