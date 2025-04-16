//These types will be used to static checking for database schema
export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  phoneNumber: string;
}

// Are not sending user password back to user. That dumb thing to do.
export interface IUserResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
