import { Router } from "express";
import { 
    registerPatient, 
    getAllDoctors, 
    getDoctorSlots, 
    bookAppointment, 
    cancelAppointment, 
    getPatientAppointments 
} from "../controllers/patient.controller.js";
import { verifyJWT, authorizeRoles } from "../middleware/verifyJWTandRole.js";

const router = Router();

// Public routes
router.route("/register").post(registerPatient);

// Protected routes (Patient only)
router.use(verifyJWT, authorizeRoles("patient"));

router.route("/doctors").get(getAllDoctors);
router.route("/doctors/:doctorId/slots").get(getDoctorSlots);
router.route("/appointments").post(bookAppointment).get(getPatientAppointments);
router.route("/appointments/:appointmentId/cancel").patch(cancelAppointment);

export default router;