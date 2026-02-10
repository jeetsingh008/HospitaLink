import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js";
import { Slot } from "../models/slot.model.js";

export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user?._id;

  if (!doctorId) {
    throw new ApiError(401, "Unauthorized: Doctor ID not found");
  }

  const appointments = await Appointment.find({ doctorId })
    .populate("patientId", "name username")
    .populate("slotId", "startTime endTime date")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully")
    );
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  const doctorId = req.user?._id;

  const allowedStatuses = ["Accepted", "Completed", "Cancelled"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid status. Must be Accepted, Completed, or Cancelled"
    );
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.doctorId.toString() !== doctorId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this appointment"
    );
  }

  appointment.status = status;
  await appointment.save();

  if (status === "Cancelled") {
    const slot = await Slot.findById(appointment.slotId);
    if (slot) {
      slot.isBooked = false;
      slot.appointmentId = null;
      await slot.save();
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, appointment, `Appointment marked as ${status}`));
});

export const createSlot = asyncHandler(async (req, res) => {
  const { date, startTime, endTime } = req.body;
  const doctorId = req.user?._id;

  if (!date || !startTime || !endTime) {
    throw new ApiError(
      400,
      "Date, start time, and end time are required to create a slot"
    );
  }

  const existingSlot = await Slot.findOne({
    doctorId,
    date,
    startTime,
  });

  if (existingSlot) {
    throw new ApiError(409, "You already have a slot created for this time");
  }

  const slot = await Slot.create({
    doctorId,
    date,
    startTime,
    endTime,
    isBooked: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, slot, "Time slot created successfully"));
});
