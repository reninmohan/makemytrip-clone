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

const allowedOrigins = [
  "https://makemytrip-clone-client.vercel.app", // Production
  "http://localhost:5173", // Vite default dev server
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow access for postman and mobile
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.options("*", cors());

//middleware to parse json in req body
app.use(express.json({ limit: "16kb" }));

//middleware to properly parse form data  in req body  & url data, extended option let parse nested objects.
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//middleware to handle all registered routes
app.use("/api", indexRouter);

//middleware to handle all unknown registered routes
app.all("*", unknownRoute);

//Global error handling middleware for route handler and middleware.
app.use(globalErrorResponse);

export default app;
