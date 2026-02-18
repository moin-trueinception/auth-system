import {Router} from "express";
import {createProfile, deleteProfile, getAllProfiles, getProfile, updateProfile} from "../controller/profileController";
import {  apiLimiters} from "../middleware/rateLimiters";
import { protect , authorize } from "../middleware/authMiddleware";
const router = Router();

router.post("/profile", protect,apiLimiters, createProfile);
router.get("/profile", protect,apiLimiters, getProfile);
router.put("/profile", protect,apiLimiters, updateProfile);
router.delete("/admin/profile", authorize("admin"), protect,apiLimiters, deleteProfile);
router.get("/admin/profiles", authorize("admin"), getAllProfiles);
export default router