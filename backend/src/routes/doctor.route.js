import { Router } from "express";
import { 
    getDoctorAppointments, 
    updateAppointmentStatus, 
    createSlot 
} from "../controllers/doctor.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, authorizeRoles("doctor"));

router.route("/slots").post(createSlot);
router.route("/appointments").get(getDoctorAppointments);
router.route("/appointments/:appointmentId/status").patch(updateAppointmentStatus);

export default router;