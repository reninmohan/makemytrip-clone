import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.DB_URL) throw new Error("DB_URL is not defined");
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected.");
  } catch (error) {
    console.log("MongoDb not connected", error);
    process.exit(1);
  }
};

export default connectDB;
