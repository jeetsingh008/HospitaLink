import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Admin } from "../models/admin.model.js";

export const login = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    throw new ApiError(400, "Username, password, and role are required");
  }

  const roleModels = {
    patient: Patient,
    doctor: Doctor,
    admin: Admin,
  };

  const SelectedModel = roleModels[role.toLowerCase()];
  if (!SelectedModel) {
    throw new ApiError(400, "Invalid role specified");
  }

  const user = await SelectedModel.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await SelectedModel.findById(user._id).select(
    "-password"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
