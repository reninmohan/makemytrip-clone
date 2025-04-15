import express from "express";
import cors from "cors";
import helmet from "helmet";
import indexRouter from "./routes/index.js";
import { globalErrorResponse, unknownRoute } from "./middlewares/index.js";

const app = express();
//middleware to parse json in req body
app.use(express.json());
app.use(cors());
//to protect app from common web vulnerabilities by setting various HTTP headers.
app.use(helmet());
//middleware to parse form data in req body , extended option let parse nested objects.
app.use(express.urlencoded({ extended: true }));

//middleware to handle all registered routes
app.use("/api", indexRouter);

//middleware to handle all unknown registered routes
app.all("*", unknownRoute);

//Global error handling middleware for route handler and middleware.
app.use(globalErrorResponse);

export default app;
