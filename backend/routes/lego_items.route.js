import {
  newItem,
  get_all_items,
  get_single_item,
  delete_single_item,
  delete_all_items,
  update_an_item,
} from "../controllers/itemController.js";
import express from "express";

const router = express.Router();

// Route to create a new item
router.route("/items").get(get_all_items); // Get all
router.route("/items/:id").get(get_single_item); // Get single

// Admin routes
router.route("/admin/items").post(newItem); // Create
router.route("/admin/items").delete(delete_all_items); // Delete all

router
  .route("/admin/items/:id")
  .patch(update_an_item)
  .delete(delete_single_item);

export default router;
