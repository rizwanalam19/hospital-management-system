import { CreateDoctor } from "../controllers/doctor.controller.js";
import Router  from "express";
const router = Router();

router.route("/create-doctor").post(CreateDoctor);

export default router