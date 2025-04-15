import express from "express";
import { userCreateSchema } from "../schemas/index.js";
import { authUser, validateInput } from "../middlewares/index.js";
import { createUser } from "../controllers/index.js";
const userRouter = express.Router();

userRouter.post("/", validateInput(userCreateSchema), createUser);

userRouter.post("/login", authUser);

export default userRouter;
