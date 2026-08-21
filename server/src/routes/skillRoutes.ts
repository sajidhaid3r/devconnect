import { Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { requireAuth } from "../middleware/auth";
import { endorseSkill, topSkills } from "../controllers/skillController";

const router = Router();

router.get("/top/:username", catchAsync(topSkills));
router.post("/endorse", requireAuth, catchAsync(endorseSkill));

export default router;
