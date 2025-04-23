import express from "express";
import { fetchAllHotels, fetchAllRoomsByHotel, fetchSpecificHotel } from "../controllers/hotel.controller.js";

const hotelRouter = express.Router();

//For all hotels details
hotelRouter.get("/", fetchAllHotels);

//For getting details for a specific hotel
hotelRouter.get("/:hotelId", fetchSpecificHotel);

//Fot getting all rooms details in a hotel
hotelRouter.get("/:hotelId/rooms", fetchAllRoomsByHotel);

export default hotelRouter;
