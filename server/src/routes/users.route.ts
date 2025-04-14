import express from "express";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { userCreateSchema } from "../db/schemas/user.schema.js";
// import { authUser } from "../middlewares/authUser.middleware.js";
import * as userController from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.post("/", validateInput(userCreateSchema), userController.createUser);

// userRouter.post("/login", authUser, userController.createUser);

export default userRouter;
