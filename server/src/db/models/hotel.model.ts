import mongoose, { Document } from "mongoose";

import { IHotel, IHotelBooking, IRoomType } from "../../schemas/hotel.schema.js";
import { HttpError } from "../../utils/ErrorResponse.utils.js";
import { IUserDocument } from "./user.model.js";

export interface IRoomTypeDocument extends Omit<IRoomType, "hotel">, Document {
  hotel: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _id: mongoose.Schema.Types.ObjectId;
}

const RoomTypeMongooseSchema = new mongoose.Schema<IRoomTypeDocument>(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "A roomtype should be associated with a hotel"],
    },
    name: {
      type: String,
      required: [true, "Room name is required"],
    },
    description: {
      type: String,
      required: [true, "Please provided some description"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity should be at atleast 1"],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Room must have price per night"],
      min: [1, "Price must be greater than 0"],
      max: [100000, "Price cannot exceed more than 1 lakh per night"],
    },
    amenities: {
      type: [String],
      required: [true, "Minimium 1 amenities should be mentioned"],
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
    },
    bedType: { type: String, required: true },
    countInStock: { type: Number, required: true, min: 1 },
  },
  {
    timestamps: true,
  },
);

const RoomType = mongoose.model<IRoomTypeDocument>("RoomType", RoomTypeMongooseSchema);

export interface IHotelDocument extends Omit<IHotel, "roomTypes">, Document {
  roomTypes: IRoomTypeDocument[];
  createdAt: Date;
  updatedAt: Date;
  _id: mongoose.Schema.Types.ObjectId;
}

// export interface IHotelDocument extends Omit<IHotel, "roomTypes">, Document {
//   roomTypes: mongoose.Schema.Types.ObjectId;
// }

const HotelMongooseSchema = new mongoose.Schema<IHotelDocument>(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      unique: [true, "Hotel name should be unique"],
    },
    description: {
      type: String,
      required: [true, "Hotel description is required"],
      trim: true,
    },
    location: {
      city: {
        type: String,
        required: [true, "Cityname is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "Statename is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Countryname is required"],
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
    },
    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    amenities: {
      type: [String],
      required: [true, "Minimium 1 amenities should be mentioned"],
    },
    roomTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomType",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Hotel = mongoose.model<IHotelDocument>("Hotel", HotelMongooseSchema);

export interface IHotelBookingDocument extends Omit<IHotelBooking, "user" | "hotel" | "roomType">, Document {
  hotel: mongoose.Schema.Types.ObjectId | IHotelDocument;
  user: mongoose.Schema.Types.ObjectId | IUserDocument;
  roomType: mongoose.Schema.Types.ObjectId | IRoomTypeDocument;
}

// export interface IHotelBookingDocument extends IHotelBooking, Document {}

const HotelBookingMongooseSchema = new mongoose.Schema<IHotelBookingDocument>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User details are required for booking"],
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "Hotel details are required for booking"],
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType",
    required: [true, "Roomtype is required for booking"],
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  guests: {
    adults: {
      type: Number,
      required: true,
      min: 1,
    },
    children: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [1, "Total price must be greater than 0"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  bookingDate: {
    type: Date,
    default: () => Date.now(),
  },
});

HotelBookingMongooseSchema.pre("save", function (next) {
  if (this.checkInDate >= this.checkOutDate) {
    return next(new HttpError(400, "Check-in date must be before check-out date"));
  }
  next();
});

const HotelBooking = mongoose.model<IHotelBookingDocument>("HotelBooking", HotelBookingMongooseSchema);

export { Hotel, RoomType, HotelBooking };
