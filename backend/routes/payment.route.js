import express from "express";
import {
  createCheckoutSession,
  getPaymentSuccessDetails,
  getUserPurchases,
  getAllTickets,
  getPaypalClientId,
  createPaypalCheckout,
  capturePaypalCheckout,
} from "../controllers/paymentController.js";
import {
  isAuthenticatedUser,
  isAuthorizedUser,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/checkout-session")
  .post(isAuthenticatedUser, createCheckoutSession);

// PayPal routes
router.route("/paypal/client-id").get(getPaypalClientId);
router
  .route("/paypal/create-order")
  .post(isAuthenticatedUser, createPaypalCheckout);
router
  .route("/paypal/capture-order")
  .post(isAuthenticatedUser, capturePaypalCheckout);

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
