import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "patient",
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);
