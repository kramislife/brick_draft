import express from "express";
import {
  createCollection,
  deleteCollectionByID,
  getAllCollections,
  getCollectionById,
  updateCollection,
  uploadCollectionImage,
} from "../controllers/collectionController.js";
import {
  isAuthenticatedUser,
  isAuthorizedUser,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/collections").get(getAllCollections);
router.route("/collection/:id").get(getCollectionById);

// Admin routes - require authentication and admin role
router
  .route("/admin/newCollection")
  .post(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    createCollection
  );
router
  .route("/admin/collections/:id")
  .put(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    updateCollection
  );
router
  .route("/admin/collection/:id")
  .delete(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    deleteCollectionByID
  );
router
  .route("/admin/collection/:id/upload_image")
  .put(
    isAuthenticatedUser,
    isAuthorizedUser("admin", "superAdmin"),
    uploadCollectionImage
  );

export default router;
