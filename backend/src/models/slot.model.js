import mongoose, { Schema } from "mongoose";

const slotSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    doctorID: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      default: null, // Only populated when a booking occurs
    },
  },
  { timestamps: true }
);

export const Slot = mongoose.model("Slot", slotSchema);
