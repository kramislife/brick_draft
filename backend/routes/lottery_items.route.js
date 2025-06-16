import {
  get_all_items,
  get_item_by_id,
  new_item,
} from "../controllers/itemController.js";
import express from "express";

const router = express.Router();

// Route to create a new item
router.route("/admin/newitem").post(new_item);
router.route("/allitems").get(get_all_items);
router.route("/item/:id").get(get_item_by_id);

export default router;
