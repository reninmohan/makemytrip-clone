import express from "express";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { userLoginSchema, userRegistrationSchema } from "../schemas/user.schema.js";
import { createUser } from "../controllers/user.controller.js";
import { authUser } from "../controllers/auth.controller.js";
import { authorization } from "../middlewares/authorization.middleware.js";
import { testmidandcontroller } from "../middlewares/test.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", validateInput(userRegistrationSchema), createUser);

authRouter.post("/login", validateInput(userLoginSchema), authUser);

authRouter.post("/:me", authorization, testmidandcontroller);

export default authRouter;
