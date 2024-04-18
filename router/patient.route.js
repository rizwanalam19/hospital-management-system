import { CreatePatient } from "../controllers/patient.controller.js";
import { DischargePatient } from "../controllers/patient.controller.js"
import Router  from "express";
const router = Router();

router.route("/create-patient").post(CreatePatient);
router.route("/discharge-patient/:id").post(DischargePatient);

export default router