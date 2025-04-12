import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER } = process.env;
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
      console.log("MongoDb connection failed: ", error.message);
    }
    process.exit(1);
  }
};

//Mongoose event listeners for connection status
mongoose.connection.on("error", (error) => {
  console.error("Mongoose connected error", error);
});

process.on("SIGINT", async () => {
  console.log("Mongoose connection closed due to app termination.");
  await mongoose.connection.close();
  process.exit(0);
});
