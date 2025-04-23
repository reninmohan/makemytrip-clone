import express, { RequestHandler } from "express";
import { createHotel, deleteHotel, fetchSpecificHotel, updateHotel } from "../controllers/hotel.controller.js";
import { createRoomType, getRoomTypeById, updateRoomType } from "../controllers/roomtype.controller.js";
import { loginByAdmin } from "../controllers/admin.controller.js";
import { authAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { handleImageUpload } from "../middlewares/imageUpload.middleware.js";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { createHotelSchema, createRoomTypeSchema, updateHotelSchema, updateRoomTypeSchema } from "../schemas/hotel.schema.js";
import { userLoginSchema } from "../schemas/user.schema.js";
import { deleteRoomType } from "../controllers/roomtype.controller.js";
import { showAllHotelBooking } from "../controllers/booking.controller.js";

const adminRouter = express.Router();

//Login only for admin & token generate.
adminRouter.post("/login", validateInput(userLoginSchema), loginByAdmin);

//////////////////////////////////////////////////////////////////////////////////////////////////////
//Protected routes for admin for hotel CRUD operation

//Add a new hotel
adminRouter.post("/hotels", authAdmin, upload.array("images", 6), handleImageUpload as RequestHandler, validateInput(createHotelSchema), createHotel);

//Update hotel details of a specific hotel
adminRouter.put("/hotels/:hotelId", authAdmin, upload.array("images", 6), handleImageUpload as RequestHandler, validateInput(updateHotelSchema), updateHotel);

//Delete a particular hotel
adminRouter.delete("/hotels/:hotelId", authAdmin, deleteHotel);

//Search details for a particular hotel
adminRouter.get("/hotels/:hotelId", authAdmin, fetchSpecificHotel);

////////////////////////////////////////////////////////////////////////////////////////////////////////
//Protected routes for admin for roomtype  CRUD operation

//Create a new roomtype
adminRouter.post("/roomtypes", authAdmin, upload.array("images", 6), handleImageUpload as RequestHandler, validateInput(createRoomTypeSchema), createRoomType);

//Update a roomtype
adminRouter.put("/roomtypes/:roomid", authAdmin, upload.array("images", 6), handleImageUpload as RequestHandler, validateInput(updateRoomTypeSchema), updateRoomType);

//Delete a particular roomtype
adminRouter.delete("/roomtypes/:roomid", authAdmin, deleteRoomType);

//Fetch details of specific roomtype
adminRouter.get("/roomtypes/:roomid", authAdmin, getRoomTypeById);

////////////////////////////////////////////////////////////////////////////////////////////////////////////

//View all hotel bookings
adminRouter.get("/bookings/hotel", authAdmin, showAllHotelBooking);

//View all flights bookings
adminRouter.get("/bookings/flight", authAdmin);

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Add a new flights
adminRouter.post("/flights", authAdmin);

//Update flights details of a specific flights
adminRouter.put("/flights/:id", authAdmin);

//Delete a particular flights
adminRouter.delete("/flights/:id", authAdmin);

export default adminRouter;
