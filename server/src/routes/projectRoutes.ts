import { Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  listProjectsByUser,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";

const router = Router();

router.get("/user/:username", catchAsync(listProjectsByUser));
router.post("/", requireAuth, upload.single("image"), catchAsync(createProject));
router.patch("/:id", requireAuth, catchAsync(updateProject));
router.delete("/:id", requireAuth, catchAsync(deleteProject));

export default router;
