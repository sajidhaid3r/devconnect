import { Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { requireAuth } from "../middleware/auth";
import { listNotifications, markRead } from "../controllers/notificationController";

const router = Router();
router.use(requireAuth);

router.get("/", catchAsync(listNotifications));
router.patch("/:id/read", catchAsync(markRead));

export default router;
