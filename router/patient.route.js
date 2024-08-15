import { CreatePatient } from "../controllers/patient.controller.js";
import { DischargePatient } from "../controllers/patient.controller.js"
import VerifyjwtToken from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import Router  from "express";
const router = Router();

router.route("/create-patient").post(VerifyjwtToken, roleMiddleware(['manager', 'admin']),CreatePatient);
router.route("/discharge-patient/:id").post(DischargePatient);

export default router