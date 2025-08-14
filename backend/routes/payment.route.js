import express from "express";
import {
  createCheckoutSession,
  getPaymentSuccessDetails,
  getUserPurchases,
  getAllTickets,
} from "../controllers/paymentController.js";
import {
  isAuthenticatedUser,
  isAuthorizedUser,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/checkout-session")
  .post(isAuthenticatedUser, createCheckoutSession);

router
  .route("/ticket/:purchaseId")
  .get(isAuthenticatedUser, getPaymentSuccessDetails);

router.route("/user/purchases").get(isAuthenticatedUser, getUserPurchases);

router
  .route("/admin/tickets")
  .get(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    getAllTickets
  );

export default router;
