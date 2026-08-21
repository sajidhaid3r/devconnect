import { Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { getProfile, updateProfile, uploadAvatar, searchDevelopers } from "../controllers/userController";

const router = Router();

router.get("/search", catchAsync(searchDevelopers));
router.get("/:username", catchAsync(getProfile));
router.patch("/me", requireAuth, catchAsync(updateProfile));
router.post("/me/avatar", requireAuth, upload.single("avatar"), catchAsync(uploadAvatar));

export default router;
