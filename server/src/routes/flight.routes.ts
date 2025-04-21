import express from "express";

const flightRouter = express.Router();

//For gettting all available flights (with filters like source, destination,date)
flightRouter.get("/");

//Get full details of a specific flight
flightRouter.get("/:flightId");

//Book a fligth (add passenger, seats and payment)
flightRouter.post("/:flightId/book");

export default flightRouter;
