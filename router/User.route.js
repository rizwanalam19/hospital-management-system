import { CreateUser, LoginUser, LogoutUser } from "../controllers/user.controller.js";
import Router from "express";
const router = Router();

router.route("/create-user").post(CreateUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(LogoutUser);

export default router