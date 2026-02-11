import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";

export const getAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({ role: "doctor" }).select("-password");
    
    if (!doctors) {
        throw new ApiError(404, "No doctors found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, doctors, "Doctors fetched successfully")
        );
});


export const addDoctor = asyncHandler(async (req, res) => {
  const { name, username, password, phoneNumber, specialization } = req.body;

  if (
    [name, username, password, phoneNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required to register a doctor");
  }

  const existingDoctor = await Doctor.findOne({ username });
  if (existingDoctor) {
    throw new ApiError(409, "A doctor with this username already exists");
  }

  const doctor = await Doctor.create({
    name,
    username,
    password,
    phoneNumber,
    specialization: specialization || "General Physician",
    role: "doctor",
  });

  const createdDoctor = await Doctor.findById(doctor._id).select("-password");

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdDoctor, "Doctor added successfully by Admin")
    );
});

export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patientId", "name username")
    .populate("doctorId", "name specialization")
    .populate("slotId", "date startTime endTime")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "All hospital appointments fetched")
    );
});
