//These types will be used to static checking for database schema
export interface User {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

// Are not sending user password back to user. That dumb thing to do.
export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
