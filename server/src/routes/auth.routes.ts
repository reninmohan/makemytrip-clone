import express from "express";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { userLoginSchema, userRegistrationSchema } from "../schemas/user.schema.js";
import { createUser } from "../controllers/user.controller.js";
import { loginUserAndCreateToken, logoutUser, refreshAccessToken } from "../controllers/auth.controller.js";
import { loginSuccessTest } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", validateInput(userRegistrationSchema), createUser);

authRouter.post("/login", validateInput(userLoginSchema), loginUserAndCreateToken);

authRouter.post("/refresh-token", refreshAccessToken);

//All protected auth routes

authRouter.post("/logout", authUser, logoutUser);

authRouter.get("/me", authUser, loginSuccessTest);

export default authRouter;
