import express from "express";
import {
  createCollection,
  deleteCollectionByID,
  getAllCollections,
  getCollectionById,
  updateCollection,
  uploadCollectionImage,
} from "../controllers/collectionController.js";

const router = express.Router();

router.route("/collections").get(getAllCollections);
router.route("/collection/:id").get(getCollectionById);

// Admin routes

router.route("/admin/newCollection").post(createCollection);
router.route("/admin/collections/:id").put(updateCollection);
router.route("/admin/collection/:id").delete(deleteCollectionByID);
router.route("/admin/collection/:id/upload_image").put(uploadCollectionImage);

export default router;
