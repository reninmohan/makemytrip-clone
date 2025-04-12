import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import unknownRouteHandler from "./middlewares/unknownRoute.middleware.js";
import { connectDB } from "./db/config/db.js";
import { PORT as ENVPORT } from "./config/env.config.js";

const app = express();

const PORT = ENVPORT || 3000;

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
