import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { createFlightBooking, createHotelBooking } from "../controllers/booking.controller.js";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { createHotelBookingSchema } from "../schemas/hotel.schema.js";
import { flightBookingRequestSchema } from "../schemas/flight.schema.js";

const bookingRouter = express.Router();

//For booking hotel
bookingRouter.post("/hotel", authUser, validateInput(createHotelBookingSchema), createHotelBooking);
bookingRouter.post("/flight", authUser, validateInput(flightBookingRequestSchema), createFlightBooking);

export default bookingRouter;
