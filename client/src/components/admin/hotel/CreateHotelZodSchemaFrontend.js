import { z } from "zod";

const capitalizeFirstLetter = (str) => {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const hotelSchema = z.object({
  name: z
    .string()
    .min(5, "Hotel name is required.")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long.")
    .max(1000, "Description cannot exceed 1000 characters.")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  city: z
    .string()
    .min(3, "City name is required.")
    .max(30, "City name cannot exceed 30 characters")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  state: z
    .string()
    .min(3, "State name is required.")
    .max(30, "State name cannot exceed 30 characters")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  address: z
    .string()
    .max(500, "Address cannot exceed 500 characters")
    .transform((val) => val.trim())
    .optional(),
  latitude: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => val === undefined || (Number(val) >= -90 && Number(val) <= 90), "Latitude must be between -90 and 90"),
  longitude: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => val === undefined || (Number(val) >= -180 && Number(val) <= 180), "Longitude must be between -180 and 180"),
  country: z
    .string()
    .min(3, "Country name is required.")
    .max(30, "Country name cannot exceed 30 characters")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  rating: z.coerce.number().min(1).max(5).default(1),
  amenities: z
    .array(
      z
        .string()
        .transform((val) => val.trim())
        .transform((val) => val.toUpperCase()),
    )
    .min(1, "At least one amenity is required.")
    .max(20, "Cannot have more than 20 amenities."),
  roomTypes: z.array(z.string().min(1)).default([]),
});

export { hotelSchema };
