import express from "express";
import {
  getAllLotteries,
  getLotteryById,
  createLottery,
  updateLottery,
  deleteLottery,
  getLotteryPartsWithQuery,
  getSocketConfig,
} from "../controllers/lotteryController.js";
import {
  isAuthenticatedUser,
  isAuthorizedUser,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.route("/lotteries").get(getAllLotteries);
router.route("/lotteries/:id").get(getLotteryById);
router.route("/lotteries/:id/parts").get(getLotteryPartsWithQuery);
router.route("/socket-config").get(getSocketConfig);

// Admin routes
router
  .route("/admin/lotteries")
  .post(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    createLottery
  );
router
  .route("/admin/lotteries/:id")
  .put(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    updateLottery
  )
  .delete(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    deleteLottery
  );

export default router;
