import express, { RequestHandler } from "express";
import { createHotel, deleteHotel, fetchSpecificHotel, updateHotel } from "../controllers/hotel.controller.js";
import { createRoomType, getRoomTypeById, updateRoomType } from "../controllers/roomtype.controller.js";
import { loginByAdmin } from "../controllers/admin.controller.js";
import { authAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { handleImageUpload, handleSingleImageUpload } from "../middlewares/imageUpload.middleware.js";
import { validateInput } from "../middlewares/validateInput.middleware.js";
import { createHotelSchema, createRoomTypeSchema, updateHotelSchema, updateRoomTypeSchema } from "../schemas/hotel.schema.js";
import { userLoginSchema } from "../schemas/user.schema.js";
import { deleteRoomType } from "../controllers/roomtype.controller.js";
import { showAllHotelBooking } from "../controllers/booking.controller.js";
import { createAirlineSchema, createAirportSchema, createFlightSchema, updateAirlineSchema, updateAirportSchema, updateFlightSchema } from "../schemas/flight.schema.js";
import { createAirline, createAirport, createFlight, deleteAirline, deleteAirport, deleteFlight, showAllAirlines, showAllFlight, updateAirline, updateAirport, updateFlight } from "../controllers/flight.controller.js";

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
//Create a new airline
adminRouter.post("/airlines", authAdmin, upload.single("logo"), handleSingleImageUpload as RequestHandler, validateInput(createAirlineSchema), createAirline);

//Update a airline
adminRouter.put("/airlines/:airlineId", authAdmin, upload.single("logo"), handleSingleImageUpload as RequestHandler, validateInput(updateAirlineSchema), updateAirline);

//Delete a particular airline
adminRouter.delete("/airlines/:airlineId", authAdmin, deleteAirline);

//Retrieves a list of all airlines
adminRouter.get("/airlines", authAdmin, showAllAirlines);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create a new airport
adminRouter.post("/airports", authAdmin, validateInput(createAirportSchema), createAirport);

//Update a airport
adminRouter.put("/airports/:airportId", authAdmin, validateInput(updateAirportSchema), updateAirport);

//Delete a particular airport
adminRouter.delete("/airports/:airportId", authAdmin, deleteAirport);

//Retrieves a list of all airport
adminRouter.get("/airports", authAdmin, showAllFlight);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create a new flight
adminRouter.post("/flights", authAdmin, validateInput(createFlightSchema), createFlight);

//Update a flight
adminRouter.put("/flights/:flightId", authAdmin, validateInput(updateFlightSchema), updateFlight);

//Delete a particular flight
adminRouter.delete("/flights/:flightId", authAdmin, deleteFlight);

//Retrieves a list of all flight
adminRouter.get("/flights", authAdmin, showAllFlight);

export default adminRouter;
