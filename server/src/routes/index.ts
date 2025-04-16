import { Router } from "express";
// import userRouter from "./users.route.js";
import authRouter from "./auth.routes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
// indexRouter.use("/users", userRouter);

// indexRouter.use("/auth");

export default indexRouter;
