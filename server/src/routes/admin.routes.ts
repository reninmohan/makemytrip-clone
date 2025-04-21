import express, { RequestHandler } from "express";
import { authAdmin } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/auth.controller.js";
import { loginByAdmin } from "../controllers/admin.controller.js";
import { createHotel, deleteHotel, fetchHotel, updateHotel } from "../controllers/hotel.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { handleImageUpload } from "../middlewares/imageUpload.middleware.js";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { createHotelSchema, roomTypeSchema, updateHotelSchema, updateRoomTypeSchema } from "../schemas/hotel.schema.js";
import { userLoginSchema } from "../schemas/user.schema.js";
import { createRoomType, updateRoomType } from "../controllers/roomtype.controller.js";
import { deleteRoomType } from "../services/roomType.services.js";
const adminRouter = express.Router();

//Login only for admin
adminRouter.post("/login", validateInput(userLoginSchema), loginByAdmin);

//////////////////////////////////////////////////////////////////////////////////////////////////////

//Protected routes for admin

//Logout only for admin
adminRouter.post("/logout", authAdmin, logoutUser);

//Add a new hotel
adminRouter.post("/hotels", authAdmin, upload.array("images", 6), handleImageUpload as RequestHandler, validateInput(createHotelSchema), createHotel);

//Update hotel details of a specific hotel
adminRouter.put("/hotels/:hotelId", authAdmin, upload.array("images", 6), handleImageUpload as RequestHandler, validateInput(updateHotelSchema), updateHotel);

//Delete a particular hotel
adminRouter.delete("/hotels/:hotelId", authAdmin, deleteHotel);

//Search details for a particular hotel

adminRouter.get("/hotels/:hotelId", authAdmin, fetchHotel);

////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create a new roomtype
adminRouter.post("/roomtypes", authAdmin, upload.array("images", 6), handleImageUpload as RequestHandler, validateInput(roomTypeSchema), createRoomType);

//Update a roomtype
adminRouter.put("/roomtypes/:roomid", authAdmin, upload.array("images", 6), handleImageUpload as RequestHandler, validateInput(updateRoomTypeSchema), updateRoomType);

//Delete a particular roomtypes
adminRouter.delete("/roomtypes/:roomid", authAdmin, deleteRoomType);

////////////////////////////////////////////////////////////////////////////////////////////////////////////

//View all hotel bookings
adminRouter.get("/hotels/bookings", authAdmin);

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Add a new flights
adminRouter.post("/flights", authAdmin);

//Update flights details of a specific flights
adminRouter.put("/flights/:id", authAdmin);

//Delete a particular flights
adminRouter.delete("/flights/:id", authAdmin);

//View all flights bookings
adminRouter.get("/flights/bookings", authAdmin);

export default adminRouter;
