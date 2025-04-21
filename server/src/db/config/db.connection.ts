//Using node we cant directly talk to mongodb, we use mongooose as connector but since db calls are async to do it an async function, prepare to function
//  1. for connection  2. for disconnection
import mongoose from "mongoose";
import ENV from "../../config/env.config.js";
import { DB_NAME } from "../../constants.js";

export const connectDB = async (): Promise<void> => {
  try {
    if (!ENV.MONGODB_URL) throw new Error("MONGO_URL is missing in env.");
    await mongoose.connect(ENV.MONGODB_URL, { dbName: DB_NAME });
    console.clear();
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to connect to MongoDB: ", error.message);
      console.log("Shutting down all process....");
      process.exit(0);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while disconnecting from MongoDB.", error.message);
    }
  }
};
