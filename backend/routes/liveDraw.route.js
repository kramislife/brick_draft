import express from "express";
import {
  getPerformanceMetrics,
  cleanupLiveDraw,
} from "../controllers/liveDrawController.js";
import {
  isAuthenticatedUser,
  isAuthorizedUser,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin routes for live draw management
router
  .route("/admin/live-draw/metrics")
  .get(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    getPerformanceMetrics
  );

router
  .route("/admin/live-draw/cleanup")
  .post(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    cleanupLiveDraw
  );

export default router;
