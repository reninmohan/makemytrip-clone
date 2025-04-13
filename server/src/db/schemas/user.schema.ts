//This is a zod schema which will be used by zod schema parser to check if inputs are validated and correct.
// named export user schema and named export schema types
import { z } from "zod";

export const userCreateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
