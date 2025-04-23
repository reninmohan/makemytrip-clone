//This is a zod schema which will be used by zod schema parser to check if inputs are validated and correct.
// named export user schema and named export schema types
import { z } from "zod";

//here userCreateSchema is zod schema object, these rules will be used runtime validation.
export const userRegistrationSchema = z.object({
  fullName: z.string().min(3, "FullName must be at least 3 characters.").toLowerCase(),
  email: z.string().email("Invalid email format").toLowerCase(),
  password: z.string().min(8, "Password must be atleast 8 characters"),
  role: z.enum(["user", "admin"]).default("user"),
  phoneNumber: z.string().min(10, "Phone number must atleast be 10 digits").regex(/^\d+$/, { message: "Phone number must contain digits only" }),
});

export const userLoginSchema = userRegistrationSchema.pick({ email: true, password: true });
export const userProfileUpdateSchema = userRegistrationSchema.omit({ role: true, password: true }).partial();
export const userPasswordChangeSchema = userRegistrationSchema.pick({ password: true });

//This line convert zod schema to typescript type
export type IUserRegistration = z.infer<typeof userRegistrationSchema>;
export type IUserLogin = z.infer<typeof userLoginSchema>;
