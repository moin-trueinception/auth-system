import {Router} from "express";
import {register,login,forgetPassword,resetPassword} from "../controller/authController";
import { loginLimiter , apiLimiters, strictPasswordLimiter} from "../middleware/rateLimiters";
const router = Router();
router.post("/register",apiLimiters,register);
router.post("/login",loginLimiter,login);
router.post("/forgot-password",strictPasswordLimiter,forgetPassword);
router.post("/reset-password",strictPasswordLimiter,resetPassword);
export default router