import { Router } from "express";
import userRouter from "./users.route.js";
import authRouter from "./auth.routes.js";
import hotelRouter from "./hotel.routes.js";
import adminRouter from "./admin.routes.js";
import roomTypeRouter from "./roomtypes.routes.js";
import availabilityRoute from "./availability.routes.js";
import bookingRouter from "./booking.routes.js";

const indexRouter = Router();

indexRouter.use("/admin", adminRouter);
indexRouter.use("/auth", authRouter);
indexRouter.use("/hotels", hotelRouter);
indexRouter.use("/roomtypes", roomTypeRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/availability", availabilityRoute);
indexRouter.use("/booking", bookingRouter);
// indexRouter.use("/flights");

export default indexRouter;
