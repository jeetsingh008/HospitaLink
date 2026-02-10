import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/verifyJWTandRole.js";

const router = Router();

router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);

export default router;