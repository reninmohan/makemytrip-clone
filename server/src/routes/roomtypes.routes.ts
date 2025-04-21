import express from "express";
import { bookRoom, checkRoomAvailability, getRoomTypeById } from "../controllers/roomtype.controller.js";
import { getAllRoomTypes } from "../controllers/roomtype.controller.js";
const roomTypeRouter = express.Router();

// Get all room types
roomTypeRouter.get("/", getAllRoomTypes);

// Get specific room type details
roomTypeRouter.get("/:id", getRoomTypeById);

// Check availability of a room type
roomTypeRouter.post("/:id/availability", async (req, res, next) => {
  await checkRoomAvailability(req, res, next);
});

// Book a room type
roomTypeRouter.post("/:id/book", async (req, res, next) => {
  await bookRoom(req, res, next);
});

export default roomTypeRouter;
