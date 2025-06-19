import express from "express";
import {
  contactUs,
  forgotPassword,
  getCurrentUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateCurrentUserPassword,
  updateCurrentUserProfile,
  updateProfilePicture,
  verifyUser,
} from "../controllers/authController.js";

import { isAuthenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/verify_user/:token").get(verifyUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/profile/me").get(isAuthenticatedUser, getCurrentUserProfile);
router
  .route("/me/profile/updatePassword")
  .put(isAuthenticatedUser, updateCurrentUserPassword);
router
  .route("/me/profile/updateProfile")
  .put(isAuthenticatedUser, updateCurrentUserProfile);
router
  .route("/me/profile/updateAvatar")
  .put(isAuthenticatedUser, updateProfilePicture);
router.route("/contact").post(contactUs);

export default router;
