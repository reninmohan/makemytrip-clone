import { HttpError } from "../utils/ErrorResponse.utils.js";
import { Hotel, RoomType } from "../db/models/hotel.model.js";
import { RequestWithUserAndBody } from "./hotel.services.js";
import { IRoomType } from "../types/hotel.types.js";
import { MongoServerError } from "mongodb";
import { RequestWithUser } from "../middlewares/auth.middleware.js";
import { Response, NextFunction, Request } from "express";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

export const createRoomType = async (roomTypeData: RequestWithUserAndBody<IRoomType>) => {
  try {
    if (roomTypeData.body.images.length === 0 || !Array.isArray(roomTypeData.body.images)) {
      throw new HttpError(401, "Images url are empty.At least one image is required.");
    }
    const roomType = new RoomType({ ...roomTypeData.body, images: roomTypeData.body.images });
    await roomType.save();

    await Hotel.findByIdAndUpdate(roomTypeData.body.hotel, {
      $push: { roomTypes: roomType._id },
    });

    return roomType;
  } catch (error) {
    console.log(error);
    throw new HttpError(500, "Failed to create room type in database", error);
  }
};

export const updateRoomTypeService = async (reqData: RequestWithUserAndBody<Partial<IRoomType>>) => {
  try {
    const { roomid } = reqData.params;
    if (!roomid) {
      throw new HttpError(401, "RoomId params is required for roomtype updatation.");
    }
    const roomType = await RoomType.findById(roomid);
    if (!roomType) {
      throw new HttpError(404, "Roomtype not found in db.");
    }

    Object.assign(roomType, reqData.body);
    await roomType.save();

    return roomType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.cause instanceof MongoServerError && error?.cause?.code === 11000) {
      const errorMessage = Object.keys(error?.cause.keyValue)[0];
      throw new HttpError(401, `Hotel ${errorMessage} should be unique`, error.cause);
    }
    throw new HttpError(500, "Unexcepted Error : Unable to update hotel details.", error);
  }
};

export const deleteRoomTypeService = async (reqData: RequestWithUser) => {
  const { roomid } = reqData.params;
  if (!roomid) {
    throw new HttpError(401, "RoomId params is required for roomtype deletion.");
  }
  const roomType = await RoomType.findByIdAndDelete(roomid);
  if (!roomType) {
    throw new HttpError(404, "Roomtype not found in db or already deleted.");
  }

  return roomType;
};

export const getAllRoomTypesService = async () => {
  const allRoomTypes = await RoomType.find();
  return allRoomTypes;
};
export const getRoomTypeByIdService = async (req: Request) => {
  const { roomid } = req.params;

  if (!roomid) {
    throw new HttpError(401, "roomid params is required to fetch roomtype details.");
  }

  const roomType = await RoomType.findById({ _id: roomid });
  console.log(roomType);
  if (!roomType) {
    throw new HttpError(404, "Mentioned roomtype is not found in db.");
  }

  return roomType;
};
export const checkRoomAvailabilityService = async () => {};
export const bookRoomService = async () => {};
export const deleteRoomType = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const deletedRoomType = await deleteRoomTypeService(req);
    return res.status(201).json(new ApiResponse(true, "Roomtype deleted successfully", deletedRoomType));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Unable to delete the roomtype. "));
  }
};
