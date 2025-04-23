import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { fetchProfile, updateProfile, updateProfilePassword } from "../controllers/user.controller.js";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { userPasswordChangeSchema, userProfileUpdateSchema } from "../schemas/user.schema.js";
import { deleteSpecificUserHotelBooking, fetchAllUserHotelBooking, fetchSpecificUserHotelBooking } from "../controllers/booking.controller.js";
const userRouter = express.Router();

//All are user routes are protected.
//Only logged inuser related operations.

//For getting user profile
userRouter.get("/profile", authUser, fetchProfile);

//For updating user profile except password.
userRouter.put("/profile", authUser, validateInput(userProfileUpdateSchema), updateProfile);

//For updating only password for authorized user.
userRouter.put("/changepassword", authUser, validateInput(userPasswordChangeSchema), updateProfilePassword);

// Already user booked hotels and flight

//For getting all hotel booking
userRouter.get("/bookings/hotels", authUser, fetchAllUserHotelBooking);

//For getting specific hotel booking
userRouter.get("/bookings/hotel/:bookingId", authUser, fetchSpecificUserHotelBooking);

//For deleting a specific hotel booking
userRouter.delete("/bookings/hotel/:bookingId", authUser, deleteSpecificUserHotelBooking);

//For getting all flight booking
userRouter.get("/bookings/flights", authUser);

//For getting all flight booking
userRouter.get("/bookings/flight/:bookingId", authUser);

//For getting all flight booking
userRouter.delete("/bookings/flight/:bookingId", authUser);

//To
// userRouter.post("/bookings");

export default userRouter;
