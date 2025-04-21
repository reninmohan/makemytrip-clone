import { IUser } from "./user.types.js";

//USED
export interface ILocation {
  city: string;
  state: string;
  country: string;
  address?: string;
  coordinates?: {
    latitude: number; // -90 to 90
    longitude: number; // -180 to 180;
  };
}

export interface IHotel {
  name: string;
  description: string;
  location: ILocation;
  images: string[];
  rating?: number;
  amenities: string[];
  roomTypes?: string[];
}

export interface IRoomType {
  name: string;
  hotel: string; // Only ObjectId string, matching the hotel schema
  description: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  bedType: string;
  countInStock: number;
}

//NOT USED

// Add a new interface for populated room type
export interface IPopulatedRoomType extends Omit<IRoomType, "hotel"> {
  hotel: IHotel; // Populated hotel object
}

// Add a new interface for populated hotel
export interface IPopulatedHotel extends Omit<IHotel, "roomTypes"> {
  roomTypes: IRoomType[]; // When roomTypes are populated
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface IGuestInfo {
  adults: number;
  children: number;
}

export interface IPriceRange {
  min?: number;
  max?: number;
}

// Existing booking interface becomes unpopulated version
export interface IHotelBooking {
  user: string; // Only ObjectId string
  hotel: string; // Only ObjectId string
  roomType: string; // Only ObjectId string
  checkInDate: Date;
  checkOutDate: Date;
  guests: IGuestInfo;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  bookingDate: Date;
}

// New interface for populated booking
export interface IPopulatedHotelBooking extends Omit<IHotelBooking, "user" | "hotel" | "roomType"> {
  user: IUser;
  hotel: IPopulatedHotel;
  roomType: IRoomType;
}

export interface IHotelSearchParams {
  city?: string;
  country?: string;
  state?: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: IGuestInfo;
  priceRange?: IPriceRange;
  amenities?: string[];
  rating?: number;
}

// New interface for hotel creation
export interface ICreateHotel extends Omit<IHotel, "rating" | "roomTypes"> {
  name: string;
  description: string;
  location: ILocation;
  images: string[];
  amenities: string[];
}
