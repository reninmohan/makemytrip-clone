import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/error.middleware.js";
import unknownRouteHandler from "./middlewares/unknownRoute.middleware.js";
import { connectDB } from "./db/config/db.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

//Function to connect mongoose to MongoDB
connectDB();

// Routes

app.get("/", (_req, res) => {
  res.status(200).send("Hello this is the root '/' route.");
});

//Middleware to handle unknown route.
app.all("*", unknownRouteHandler);

//Global catch middleware for route and middleware error handling.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
