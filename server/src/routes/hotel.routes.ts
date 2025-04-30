import express from "express";
import { filterAndSearchAllHotels, fetchAllRoomsByHotel, getHotel } from "../controllers/hotel.controller.js";

const hotelRouter = express.Router();
// all are public routes

//For all hotels details
hotelRouter.get("/search", filterAndSearchAllHotels);

//For getting details for a specific hotel
hotelRouter.get("/:hotelId", getHotel);

//Fot getting all rooms details in a hotel
hotelRouter.get("/:hotelId/rooms", fetchAllRoomsByHotel);

export default hotelRouter;
