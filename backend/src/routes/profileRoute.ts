import { Router } from "express";
import { createProfile, deleteProfile, getAllProfiles, getProfile, updateProfile } from "../controller/profileController";
import { apiLimiters } from "../middleware/rateLimiters";
import { protect, authorize } from "../middleware/authMiddleware";
import { validateCreateProfile, validateUpdateProfile } from "../validations/profileValidation";

const router = Router();

router.post("/", protect, apiLimiters, validateCreateProfile, createProfile);
router.get("/", protect, apiLimiters, getProfile);
router.put("/", protect, apiLimiters, validateUpdateProfile, updateProfile);
// Only admin can delete profile → normal user gets 403 "access denied"
router.delete("/", authorize("admin"), protect, apiLimiters, deleteProfile);
router.get("/admin/profiles", authorize("admin"), getAllProfiles);
export default router