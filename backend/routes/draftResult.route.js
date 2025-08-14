import express from "express";
import {
  getAllCompletedDraftResults,
  getDraftResultById,
  getUserDraftResults,
} from "../controllers/draftResultController.js";
import { isAuthenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.route("/draft-results").get(getAllCompletedDraftResults);
router.route("/draft-results/:id").get(getDraftResultById);

// Authenticated routes
router
  .route("/user/draft-results")
  .get(isAuthenticatedUser, getUserDraftResults);

export default router;
