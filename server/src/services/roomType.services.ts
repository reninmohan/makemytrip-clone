import { HttpError } from "../utils/ErrorResponse.utils.js";
import { Hotel, IRoomTypeDocument, RoomType } from "../db/models/hotel.model.js";
import { RequestWithUserAndBody } from "../middlewares/auth.middleware.js";
import { IRoomType, IRoomTypeResponse } from "../schemas/hotel.schema.js";
import { RequestWithUser } from "../middlewares/auth.middleware.js";
import { Request } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toRoomTypeResponse = (roomType: IRoomTypeDocument | any): IRoomTypeResponse => {
  return {
    id: roomType._id.toString(),
    name: roomType.name,
    hotel: roomType.hotel?.toString(),
    description: roomType.description,
    capacity: roomType.capacity,
    pricePerNight: roomType.pricePerNight,
    amenities: roomType.amenities,
    images: roomType.images,
    bedType: roomType.bedType,
    countInStock: roomType.countInStock,
  };
};

export const createRoomTypeService = async (req: RequestWithUserAndBody<IRoomType>): Promise<IRoomTypeResponse> => {
  if (req.body.images.length === 0 || !Array.isArray(req.body.images)) {
    console.log("secondary check for image triggered.");
    throw new HttpError(401, "Images url are empty.At least one image is required.");
  }
  const roomType = new RoomType({ ...req.body });
  try {
    await roomType.save();
    await Hotel.findByIdAndUpdate(req.body.hotel, {
      $push: { roomTypes: roomType._id },
    });
    return toRoomTypeResponse(roomType);
  } catch (error) {
    throw new HttpError(500, "Failed to create room type in db", error);
  }
};

export const updateRoomTypeService = async (req: RequestWithUserAndBody<Partial<IRoomType>>): Promise<IRoomTypeResponse> => {
  const { roomid } = req.params;
  if (!roomid) {
    throw new HttpError(400, "RoomId params is required for roomtype updatation.");
  }

  const roomType = await RoomType.findById(roomid);

  if (!roomType) {
    throw new HttpError(400, "Roomtype not found in db.");
  }

  const { hotel, ...restFields } = req.body;
  Object.assign(roomType, restFields);

  if (hotel && hotel.toString() !== roomType.hotel.toString()) {
    const oldHotelId = roomType.hotel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roomType.hotel = hotel as any;
    try {
      await Hotel.findByIdAndUpdate(oldHotelId, {
        $pull: { roomTypes: roomType._id },
      });
      await Hotel.findByIdAndUpdate(hotel, {
        $push: { roomTypes: roomType._id },
      });
    } catch (error) {
      throw new HttpError(500, "Failed to create room type in db", error);
    }
  }
  try {
    await roomType.save();
    return toRoomTypeResponse(roomType);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpError(500, "Unexcepted Error : Unable to update hotel details in db.", error);
  }
};

export const deleteRoomTypeService = async (req: RequestWithUser): Promise<IRoomTypeResponse> => {
  const { roomid } = req.params;
  if (!roomid) {
    throw new HttpError(401, "RoomId params is required for roomtype deletion.");
  }
  const roomType = await RoomType.findByIdAndDelete(roomid);
  if (!roomType) {
    throw new HttpError(404, "Roomtype not found in db or already deleted.");
  }
  return toRoomTypeResponse(roomType);
};

/////////////////////////////////////////////////////////////////////////////////////////

export const getAllRoomTypesService = async (): Promise<IRoomTypeResponse[]> => {
  const allRoomTypes = await RoomType.find();

  return allRoomTypes.map((roomtype) => toRoomTypeResponse(roomtype));
};

export const getRoomTypeByIdService = async (req: Request): Promise<IRoomTypeResponse> => {
  const { roomid } = req.params;
  if (!roomid) {
    throw new HttpError(401, "roomid params is required to fetch roomtype details.");
  }

  const roomType = await RoomType.findById(roomid);

  if (!roomType) {
    throw new HttpError(404, "Mentioned roomtype is not found in db.");
  }

  return toRoomTypeResponse(roomType);
};
