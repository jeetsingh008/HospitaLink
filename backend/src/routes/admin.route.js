import { Router } from "express";
import {
  addDoctor,
  getAllAppointments,
  getAllDoctors,
} from "../controllers/admin.controller.js";
import { verifyJWT, authorizeRoles } from "../middleware/verifyJWTandRole.js";

const router = Router();

router.use(verifyJWT, authorizeRoles("admin"));

router.route("/add-doctor").post(addDoctor);
router.route("/doctors").get(getAllDoctors);
router.route("/all-appointments").get(getAllAppointments);

export default router;
