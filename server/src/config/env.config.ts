//Centralized way to load env variable to process.env
import dotenv from "dotenv";
dotenv.config();
const ENV = process.env;
export default ENV;
