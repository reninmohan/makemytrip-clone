import express from "express";

const hotelRouter = express.Router();

//For all hotels details
hotelRouter.get("/");

//For getting details for a specific hotel
hotelRouter.get("/:id");

//Fot getting all rooms details in a hotel
hotelRouter.get("/:hotelId/rooms");

//Check room availability for given dates
hotelRouter.post("/:hotelId/availability");

//For booking a room at the hotel
hotelRouter.post("/:hotelId/book");

export default hotelRouter;
