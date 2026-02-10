import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    reasonOfVisit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
