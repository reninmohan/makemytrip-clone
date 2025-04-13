import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import unknownRouteHandler from "./middlewares/unknownRoute.middleware.js";
import { connectDB } from "./db/config/db.connection.js";
import ENV from "./config/env.config.js";
import userRouter from "./routes/users.route.js";

const app = express();
const PORT = ENV.PORT || 3000;
app.use(express.json());

//Function to connect mongoose to MongoDB
await connectDB();

//Mounting  userRouter as middleware for particular route /api/users
app.use("/api/users", userRouter);

//To handle unknown route in all routes.
app.all("*", unknownRouteHandler);

//Global catch middleware for route and middleware error handling.
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});

//If any unhandled error occured while startup, server will stop.
process.on("unhandledRejection", (error: unknown) => {
  console.error("Unhandled Rejection on startup occurred:", error);
  if (server) {
    server.close(() => {
      console.log("Server closed due to unhandled rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

export { server };
