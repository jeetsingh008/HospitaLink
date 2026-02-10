import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Patient } from "../models/patient.model.js";
import { Appointment } from "../models/appointment.model.js";
import { Slot } from "../models/slot.model.js";
import { Doctor } from "../models/doctor.model.js";

export const registerPatient = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;
  if ([name, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingPatient = await Patient.findOne({ username });
  if (existingPatient) {
    throw new ApiError(409, "Patient already exists");
  }

  const patient = await Patient.create({
    name,
    username,
    password,
    role: "patient",
  });

  const createdPatient = await Patient.findById(patient._id).select(
    "-password"
  );

  if (!createdPatient) {
    throw new ApiError(
      500,
      "Something went wrong while registering the patient"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdPatient, "Patient registered successfully")
    );
});

export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({}).select("-password");
  if (!doctors || doctors.length === 0) {
    throw new ApiError(404, "No doctors found");
  }

  return res.json(
    new ApiResponse(200, doctors, "Doctors fetched successfully")
  );
});

export const getDoctorSlots = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const slots = await Slot.find({
    doctorId,
    isBooked: false,
  }).sort({ date: 1, startTime: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, slots, "Available slots fetched successfully"));
});

export const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, slotId, reasonOfVisit } = req.body;

  const patientId = req.user?._id;

  if (!doctorId || !slotId || !reasonOfVisit || !patientId) {
    throw new ApiError(
      400,
      "All fields (doctor, slot, and reason) are required"
    );
  }

  const slot = await Slot.findById(slotId);

  if (!slot) {
    throw new ApiError(404, "Time slot not found");
  }

  if (slot.isBooked) {
    throw new ApiError(
      400,
      "This time slot has already been booked by another patient"
    );
  }

  if (slot.doctorId.toString() !== doctorId) {
    throw new ApiError(400, "The selected slot does not belong to this doctor");
  }

  // 4. Create the Appointment
  const appointment = await Appointment.create({
    patientId,
    doctorId,
    slotId,
    reasonOfVisit,
    appointmentDate: slot.date,
    status: "Pending",
  });

  slot.isBooked = true;
  slot.appointmentId = appointment._id;
  await slot.save();

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const patientId = req.user?._id;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.patientId.toString() !== patientId.toString()) {
    throw new ApiError(
      400,
      "You are not authorized to cancel this appointment"
    );
  }

  if (
    appointment.status === "Cancelled" ||
    appointment.status === "Completed"
  ) {
    throw new ApiError(
      400,
      `Cannot cancel an appointment that is already ${appointment.status}`
    );
  }

  appointment.status = "Cancelled";
  await appointment.save();

  const slot = await Slot.findById(appointment.slotId);
  if (slot) {
    slot.isBooked = false;
    slot.appointmentId = null;
    await slot.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointment, "Appointment cancelled successfully")
    );
});

export const getPatientAppointments = asyncHandler(async (req, res) => {
  const patientId = req.user?._id;

  if (!patientId) {
    throw new ApiError(400, "Authentication required");
  }

  const appointments = await Appointment.find({ patientId })
    .populate("doctorId", "name specialization phoneNumber")
    .populate("slotId", "startTime endTime date")
    .sort({ createdAt: -1 });

  if (!appointments || appointments.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No appointments found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully")
    );
});
