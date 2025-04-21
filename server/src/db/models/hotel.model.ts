import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const roomTypeSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "A roomtype should be associated with a hotel"],
    autopopulate: true,
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
  available: {
    type: Boolean,
    default: true,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
roomTypeSchema.plugin(autopopulate as any);

const RoomType = mongoose.model("RoomType", roomTypeSchema);

const hotelSchema = new mongoose.Schema({
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
    default: 0,
    min: 0,
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
      autopopulate: true,
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
hotelSchema.plugin(autopopulate as any);

const Hotel = mongoose.model("Hotel", hotelSchema);

const hotelBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User details are required for booking"],
    autopopulate: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "Hotel details are required for booking"],
    autopopulate: { maxDepth: 1 },
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType",
    required: [true, "Roomtype is required for booking"],
    autopopulate: true,
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
    default: Date.now,
  },
});

hotelBookingSchema.pre("save", function (next) {
  if (this.checkInDate >= this.checkOutDate) {
    return next(new Error("Check-in date must be before check-out date"));
  }
  next();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
hotelBookingSchema.plugin(autopopulate as any);

const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);

export { Hotel, RoomType, HotelBooking };
