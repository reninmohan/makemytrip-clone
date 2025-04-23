import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { createHotelBooking } from "../controllers/booking.controller.js";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { createHotelBookingSchema } from "../schemas/hotel.schema.js";

const bookingRouter = express.Router();

//For booking hotel
bookingRouter.post("/hotel", authUser, validateInput(createHotelBookingSchema), createHotelBooking);
bookingRouter.post("/flight", authUser);

export default bookingRouter;
