import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { fetchProfile, updateProfile, changeProfilePassword } from "../controllers/user.controller.js";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { userPasswordChangeSchema, userProfileUpdateSchema } from "../schemas/user.schema.js";
const userRouter = express.Router();

//All are user routes are protected.

//For getting user profile
userRouter.get("/profile", authUser, fetchProfile);

//For updating user profile except password.
userRouter.put("/profile", authUser, validateInput(userProfileUpdateSchema), updateProfile);

//For updating only password for authorized user.
userRouter.put("/change-password", authUser, validateInput(userPasswordChangeSchema), changeProfilePassword);

// Already user booked hotels and flight

//For getting all hotel + flight booking
userRouter.get("/bookings", authUser);

//For getting a specific booking details
userRouter.get("/bookings/:id", authUser);

//For deleting a specific booking details
userRouter.delete("/bookings/:id", authUser);

//To
// userRouter.post("/bookings");

export default userRouter;
