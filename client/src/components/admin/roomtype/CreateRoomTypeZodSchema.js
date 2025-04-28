const capitalizeFirstLetter = (str) => {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

import { z } from "zod";
export const roomTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required.")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  hotel: z.string().min(24),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long.")
    .max(1000, "Description cannot exceed 1000 characters.")
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  capacity: z.union([z.string(), z.number()]),
  pricePerNight: z.union([z.string(), z.number()]),
  amenities: z
    .array(
      z
        .string()
        .transform((val) => val.trim())
        .transform((val) => val.toUpperCase()),
    )
    .min(1, "At least one amenity is required.")
    .max(15, "Cannot have more than 15 amenities."),
  bedType: z
    .string()
    .transform((val) => val.trim())
    .transform(capitalizeFirstLetter),
  countInStock: z.union([z.string(), z.number()]),
});
