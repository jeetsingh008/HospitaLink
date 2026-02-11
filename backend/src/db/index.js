import mongoose from "mongoose";

export const DB_NAME = "appointment_booking_app";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB Connected DB Host :: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`\n MongoDB Connection error: ${error}`);
        process.exit(1);
    }
} 

export default connectDB;