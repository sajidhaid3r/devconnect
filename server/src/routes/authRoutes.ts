import { Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { requireAuth } from "../middleware/auth";
import {
  register,
  login,
  logout,
  me,
  githubRedirect,
  githubCallback,
} from "../controllers/authController";

const router = Router();

router.post("/register", catchAsync(register));
router.post("/login", catchAsync(login));
router.post("/logout", catchAsync(logout));
router.get("/me", requireAuth, catchAsync(me));
router.get("/github", catchAsync(githubRedirect));
router.get("/github/callback", catchAsync(githubCallback));

export default router;
