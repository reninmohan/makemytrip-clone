import express from "express";
const userRouter = express.Router();

userRouter.get("/profile");

userRouter.post("/profile");

userRouter.post("/bookings");

export default userRouter;
