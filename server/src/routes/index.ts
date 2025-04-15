import { Router } from "express";
import userRouter from "./users.route.js";

const indexRouter = Router();

indexRouter.use("/users", userRouter);

export default indexRouter;
