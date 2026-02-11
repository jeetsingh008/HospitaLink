import { ApiError } from "../utils/ApiError.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Admin } from "../models/admin.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const roleModels = { patient: Patient, doctor: Doctor, admin: Admin };
  const user = await roleModels[decodedToken.role]
    .findById(decodedToken._id)
    .select("-password");

  if (!user) throw new ApiError(401, "Invalid Access Token");

  req.user = user;
  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role: ${req.user.role} is not allowed to access this resource`
      );
    }
    next();
  };
};