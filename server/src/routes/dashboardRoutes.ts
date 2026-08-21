import { Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { requireAuth } from "../middleware/auth";
import { getDashboard } from "../controllers/dashboardController";

const router = Router();
router.get("/", requireAuth, catchAsync(getDashboard));

export default router;
