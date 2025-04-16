import { IUser } from "./user.types.js";

export interface ILocation {
  city: string;
  country: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface IRoomType {
  name: string;
  hotel: string | IHotel;
  description?: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface IHotel {
  name: string;
  description: string;
  location: ILocation;
  images: string[];
  rating: number;
  amenities: string[];
  pricePerNight: number;
  roomTypes: string[] | IRoomType[];
}

export interface IHotelBooking {
  user: string | IUser;
  hotel: string | IHotel;
  roomType: string | IRoomType;
  checkInDate: Date;
  checkOutDate: Date;
  guest: {
    adults: number;
    children: number;
  };
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus?: "pending" | "paid" | "refunded";
  bookingDate: Date;
}

export interface IHotelSearchParams {
  city?: string;
  country?: string;
  checkInDate: string;
  checkOutDate: string;
  guests: {
    adults: number;
    children: number;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  rating?: number;
}
