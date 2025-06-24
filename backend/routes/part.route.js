import express from "express";
import {
  createPart,
  deletePartById,
  getParts,
  getPartById,
  updatePart,
} from "../controllers/partController.js";
import {
  isAuthenticatedUser,
  isAuthorizedUser,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to create a new item
router.route("/parts").get(getParts); // Get all
router.route("/parts/:id").get(getPartById); // Get single

// Admin routes - require authentication and admin role
router
  .route("/admin/newPart")
  .post(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    createPart
  );
router
  .route("/admin/parts/:id")
  .put(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    updatePart
  );
router
  .route("/admin/parts/:id")
  .delete(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    deletePartById
  );

export default router;
