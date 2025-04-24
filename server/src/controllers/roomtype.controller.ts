import { Response, NextFunction, Request } from "express";
import { HttpError } from "../utils/ErrorResponse.utils.js";
import { createRoomTypeService, deleteRoomTypeService, getAllRoomTypesService, getRoomTypeByIdService, updateRoomTypeService } from "../services/roomType.services.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { RequestWithUserAndBody } from "../middlewares/auth.middleware.js";
import { IRoomType } from "../schemas/hotel.schema.js";
import { RequestWithUser } from "../middlewares/auth.middleware.js";

//Protected Routes admin control routes

export const createRoomType = async (req: RequestWithUserAndBody<IRoomType>, res: Response, next: NextFunction) => {
  try {
    const roomType = await createRoomTypeService(req);
    return res.status(201).json(new ApiResponse(true, "RoomType created successfully", roomType));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    next(new HttpError(500, "Unexpected Error: Failed to create room type", error));
  }
};

export const updateRoomType = async (req: RequestWithUserAndBody<Partial<IRoomType>>, res: Response, next: NextFunction) => {
  try {
    const updatetRoomType = await updateRoomTypeService(req);
    return res.status(200).json(new ApiResponse(true, "Roomtype updated successfully.", updatetRoomType));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Unable to update roomtype."));
  }
};

export const deleteRoomType = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const deletedRoomType = await deleteRoomTypeService(req);
    return res.status(200).json(new ApiResponse(true, "Roomtype deleted successfully", deletedRoomType));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Unable to delete the roomtype. "));
  }
};

//Unprotected public routes

export const getAllRoomTypes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allRoomTypes = await getAllRoomTypesService();
    return res.status(200).json(new ApiResponse(true, "All Roomtype details fetched successfully.", allRoomTypes));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch all roomtype details. "));
  }
};

export const getRoomTypeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomType = await getRoomTypeByIdService(req);
    return res.status(200).json(new ApiResponse(true, "Roomtype details fetched", roomType));
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unexcepted Error: Failed to fetch roomtype details."));
  }
};

// export const checkRoomAvailability = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     return res.status(201).json(new ApiResponse(true, "", null));
//   } catch (error) {
//     if (error instanceof HttpError) {
//       return next(error);
//     }
//     return next(new HttpError(500, "Unexcepted Error: . "));
//   }
// };

// export const bookRoom = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     return res.status(201).json(new ApiResponse(true, "", null));
//   } catch (error) {
//     if (error instanceof HttpError) {
//       return next(error);
//     }
//     return next(new HttpError(500, "Unexcepted Error: . "));
//   }
// };
