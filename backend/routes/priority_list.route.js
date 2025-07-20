import express from "express";
import {
  getPriorityList,
  createPriorityList,
  updatePriorityList,
  deletePriorityList,
} from "../controllers/priorityListController.js";
import { isAuthenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/priority-list/:purchaseId")
  .get(isAuthenticatedUser, getPriorityList);
router
  .route("/priority-list/:purchaseId")
  .post(isAuthenticatedUser, createPriorityList);
router
  .route("/priority-list/:purchaseId")
  .put(isAuthenticatedUser, updatePriorityList)
  .delete(isAuthenticatedUser, deletePriorityList);

export default router;
