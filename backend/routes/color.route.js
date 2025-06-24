import express from "express";
import {
  createColor,
  deleteColor,
  getAllColors,
  getColorById,
  updateColor,
} from "../controllers/colorController.js";
import {
  isAuthenticatedUser,
  isAuthorizedUser,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.route("/colors").get(getAllColors);
router.route("/color/:id").get(getColorById);

// Admin routes
router
  .route("/admin/color")
  .post(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    createColor
  );

router
  .route("/admin/color/:id")
  .put(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    updateColor
  )
  .delete(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    deleteColor
  );

export default router;
