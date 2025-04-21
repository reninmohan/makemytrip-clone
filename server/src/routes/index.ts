import { Router } from "express";
import userRouter from "./users.route.js";
import authRouter from "./auth.routes.js";
import hotelRouter from "./hotel.routes.js";
import adminRouter from "./admin.routes.js";
import roomTypeRouter from "./roomtypes.routes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/admin", adminRouter);
indexRouter.use("/hotels", hotelRouter);
indexRouter.use("/roomtypes", roomTypeRouter);
// indexRouter.use("/flights");

export default indexRouter;
