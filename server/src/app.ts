import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.js";
import { unknownRoute } from "./middlewares/unknownRoute.middleware.js";
import { globalErrorResponse } from "./middlewares/globalErrorResponse.middleware.js";

const app = express();

//to protect app from common web vulnerabilities by setting various HTTP headers.
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

//middleware to parse json in req body
app.use(express.json({ limit: "16kb" }));

//middleware to properly parse form data  in req body  & url data, extended option let parse nested objects.
app.use(express.urlencoded({ extended: true }));

//uncomment at deployment to serve static from public folder
// app.use(express.static("public"));

app.use(cookieParser());

//middleware to handle all registered routes
app.use("/api", indexRouter);

//middleware to handle all unknown registered routes
app.all("*", unknownRoute);

//Global error handling middleware for route handler and middleware.
app.use(globalErrorResponse);

export default app;
