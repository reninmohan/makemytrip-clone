import express from "express";
import { unknownRoute } from "./middlewares/unknownRoute.middleware.js";
import { globalErrorResponse } from "./middlewares/globalErrorResponse.middleware.js";
import userRouter from "./routes/users.route.js";
const app = express();

//middleware to parse json in req body
app.use(express.json());

//middleware to parse form data in req body , extended option let parse nested objects.
app.use(express.urlencoded({ extended: true }));

//middleware to handle /api/users
app.use("/api/users", userRouter);

//middleware to handle all unknown registered routes
app.all("*", unknownRoute);

//Global error handling middleware for route handler and middleware.
app.use(globalErrorResponse);

export default app;
