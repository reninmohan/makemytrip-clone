//This is a zod schema which will be used by zod schema parser to check if inputs are validated and correct.
// named export user schema and named export schema types
import { z } from "zod";

//here userCreateSchema is zod schema object, these rules will be used runtime validation.
export const userCreateSchema = z.object({
  fullName: z.string().min(5, "nName must be at least 5 characters."),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
  role: z.enum(["user", "admin"]).default("user").optional(),
});

//This line convert zod schema to typescript type
export type UserCreate = z.infer<typeof userCreateSchema>;
