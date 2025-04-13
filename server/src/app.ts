import express from "express";
import unknownRouteHandler from "./middlewares/unknownRoute.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRouter from "./routes/users.route.js";
const app = express();

//Mounting  userRouter as middleware for particular route /api/users
app.use("/api/users", userRouter);

app.use(express.json());

app.all("*", unknownRouteHandler);

//Global catch middleware for route and middleware error handling.
app.use(errorHandler);

export default app;
