import { Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { requireAuth } from "../middleware/auth";
import {
  sendRequest,
  respondRequest,
  listConnections,
  listPendingRequests,
  mutualConnections,
  removeConnection,
} from "../controllers/connectionController";

const router = Router();
router.use(requireAuth);

router.get("/", catchAsync(listConnections));
router.get("/pending", catchAsync(listPendingRequests));
router.get("/mutual/:username", catchAsync(mutualConnections));
router.post("/", catchAsync(sendRequest));
router.patch("/:id/respond", catchAsync(respondRequest));
router.delete("/:id", catchAsync(removeConnection));

export default router;
