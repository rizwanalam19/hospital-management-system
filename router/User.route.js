import { CreateUser, LoginUser, LogoutUser, changePassword } from "../controllers/user.controller.js";
import Router from "express";
import VerifyjwtToken from "../middleware/auth.middleware.js";
import { ForgetPassword } from "../controllers/user.controller.js";
import { ResetPassword } from "../controllers/user.controller.js";
const router = Router();

router.route("/create-user").post(CreateUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(VerifyjwtToken, LogoutUser);
router.route("/forgetpassword").post(ForgetPassword);
router.route("/resetpassword").post(ResetPassword);
router.route("/changepassowrd").post(VerifyjwtToken, changePassword);
export default router