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
router.route("/admin/newitem").post(newItem);
router.route("/allitems").get(get_all_items);
router.route("/item/:id").get(get_single_item);
router.route("/item/:id").patch(update_an_item);
router.route("/item/:id").delete(delete_single_item);
router.route("/allitems").delete(delete_all_items);

export default router;
