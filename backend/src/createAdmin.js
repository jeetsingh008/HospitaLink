import bcrypt from "bcrypt";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { Admin } from "./models/admin.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists in the database.");
      process.exit(0);
    }

    await Admin.create({
      name: "Super Admin",
      username: "admin",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin successfully created!");
    console.log("Username: admin");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Error creating Admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
