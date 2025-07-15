import express from "express";
import {
  createCheckoutSession,
  getPaymentSuccessDetails,
  getUserPurchases,
} from "../controllers/paymentController.js";
import { isAuthenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/checkout-session", isAuthenticatedUser, createCheckoutSession);
router.get(
  "/ticket/:purchaseId",
  isAuthenticatedUser,
  getPaymentSuccessDetails
);
router.get("/user/purchases", isAuthenticatedUser, getUserPurchases);

export default router;
