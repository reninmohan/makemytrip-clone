import express from "express";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
const userRouter = express.Router();

userRouter.post("/", validateRequest);

export default userRouter;
