import express from "express";
import { userRegistrationSchema } from "../schemas/index.js";
import { authUser, validateInput } from "../middlewares/index.js";
import { createUser } from "../controllers/index.js";
const userRouter = express.Router();

userRouter.post("/register", validateInput(userRegistrationSchema), createUser);

userRouter.post("/login", authUser);

userRouter.get("/profile");

userRouter.post("/profile");

userRouter.post("/bookings");

export default userRouter;
