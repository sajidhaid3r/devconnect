import { Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { requireAuth } from "../middleware/auth";
import { listPosts, getPost, createPost, updatePost, deletePost } from "../controllers/blogController";

const router = Router();

router.get("/", catchAsync(listPosts));
router.get("/:slug", catchAsync(getPost));
router.post("/", requireAuth, catchAsync(createPost));
router.patch("/:id", requireAuth, catchAsync(updatePost));
router.delete("/:id", requireAuth, catchAsync(deletePost));

export default router;
