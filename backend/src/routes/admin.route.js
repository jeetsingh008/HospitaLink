import { Router } from "express";
import {
  addDoctor,
  getAllAppointments,
} from "../controllers/admin.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, authorizeRoles("admin"));

router.route("/add-doctor").post(addDoctor);
router.route("/all-appointments").get(getAllAppointments);

export default router;
