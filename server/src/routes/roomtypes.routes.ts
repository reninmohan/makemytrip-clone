import express from "express";
import { getRoomTypeById } from "../controllers/roomtype.controller.js";
import { getAllRoomTypes } from "../controllers/roomtype.controller.js";
const roomTypeRouter = express.Router();

// Get all room types
roomTypeRouter.get("/", getAllRoomTypes);

// Get specific room type details
roomTypeRouter.get("/:roomid", getRoomTypeById);

export default roomTypeRouter;
