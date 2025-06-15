import { get_all_items, new_item } from "../controllers/itemController.js";
import express from "express";

const router = express.Router();

// Route to create a new item
router.route("/admin/newitem").post(new_item);
router.route("/allitems").get(get_all_items);

export default router;
