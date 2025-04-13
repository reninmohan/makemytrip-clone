/*import mongoose from "mongoose";
import { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER } from "../../config/env.config.js";

const DB_URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;

//Function to connect to mongodb connection.
export const connectDB = async () => {
  try {
    if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_CLUSTER) {
      throw new Error("Missing MongoDB credential.");
    }
    await mongoose.connect(DB_URL);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("MongoDb connection failed: ", error.message);
    }
    process.exit(1);
  }
};

//Mongoose event listeners for connection status
mongoose.connection.on("error", (error) => {
  console.error("Mongoose connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Closing MongoDB connection due to app termination...");
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error during MongoDB connection closure:", error);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
*/
//Use mongoose because we cant directly talk to mongodb but since db calls are async to do it an async function, prepare to function
//  1. for connection  2. for disconnection

import mongoose from "mongoose";
import ENV from "../../config/env.config.js";

export const connectDB = async (): Promise<void> => {
  try {
    if (!ENV.MONGODB_URL) throw new Error("MONGO_URL is unavailable.");
    await mongoose.connect(ENV.MONGODB_URL);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    if (error instanceof Error) console.error("Failed to connect to MongoDB", error.message);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB successfully.");
  } catch (error) {
    if (error instanceof Error) console.error("Error while disconnectig from MongoDB.", error.message);
  }
};
