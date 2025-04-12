import dotenv from "dotenv";
dotenv.config();
export const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER, PORT } = process.env;
