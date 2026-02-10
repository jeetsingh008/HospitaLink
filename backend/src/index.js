import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();
