import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { checkHotelAvailability } from "../controllers/hotel.controller.js";

const availabilityRoute = express.Router();

//Check availability of hotel
availabilityRoute.post("/hotel/:hotelId/availability", authUser, checkHotelAvailability);

//Check availability of flight
// availabilityRoute.post("/flight/:flightId/availability", authUser, checkFlightAvailability);

//Future use case search based on roomtype
// availabilityRoute.post("/roomtype/:roomid");

export default availabilityRoute;
