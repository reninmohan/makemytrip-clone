//This is a zod schema which will be used by zod schema parser to check if inputs are validated and correct.
// named export user schema and named export schema types
import { z } from "zod";

//here userCreateSchema is zod schema object, these rules will be used runtime validation.
export const userRegistrationSchema = z.object({
  fullName: z.string().min(3, "FullName must be at least 3 characters."),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
  role: z.enum(["user", "admin"]).default("user").optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must atleast be 10 digits")
    .max(15, "Phone number must be most 15 digits"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

//This line convert zod schema to typescript type
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
