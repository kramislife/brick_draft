import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ItemCollection from "../models/itemCollection.model.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import { deleteImage, uploadImage } from "../utills/cloudinary.js";

//------------------------------------ GET ALL COLLECTIONS => GET /collections ------------------------------------
export const getAllCollections = catchAsyncErrors(async (req, res, next) => {
  const collections = await ItemCollection.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: `${collections.length} collections retrieved`,
    collections,
  });
});

//------------------------------------ GET COLLECTION BY ID => GET /collections/:id ------------------------------------

export const getCollectionById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const collection = await ItemCollection.findById(id);
  if (!collection) {
    return next(new customErrorHandler("Collection not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Collection retrieved successfully",
    collection,
  });
});

// --------------------------------------------------- ADMIN ----------------------------------------------------------

//------------------------------------ CREATE NEW COLLECTION => admin/newCollection ------------------------------------

export const createCollection = catchAsyncErrors(async (req, res, next) => {
  const { name, description, image } = req.body;

  // Validate required fields
  if (!name || !description) {
    return next(
      new customErrorHandler("Name and description are required", 400)
    );
  }

  // Handle image upload if provided
  let imageData = null;
  if (image) {
    try {
      imageData = await uploadImage(image, "brick_draft/collections");
    } catch (error) {
      return next(new customErrorHandler("Failed to upload image", 500));
    }
  }

  const collectionData = {
    name,
    description,
    ...(imageData && { image: imageData }),
    createdBy: req.user.user_id,
  };

  const newCollection = await ItemCollection.create(collectionData);

  if (!newCollection) {
    return next(new customErrorHandler("Failed to create new collection", 500));
  }

  res.status(201).json({
    success: true,
    message: "Collection created successfully",
    newCollection,
  });
});

//------------------------------------ UPDATE COLLECTION => admin/collections/:id ------------------------------------

export const updateCollection = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, image } = req.body;

  // Get the existing collection first
  const existingCollection = await ItemCollection.findById(id);
  if (!existingCollection) {
    return next(new customErrorHandler("Collection not found", 404));
  }

  const updateData = {
    name,
    description,
    updatedBy: req.user.user_id,
  };

  // Only process the image if it's a new base64 string
  if (image && typeof image === "string" && image.startsWith("data:image")) {
    try {
      // Delete old image if it exists
      if (existingCollection.image?.public_id) {
        await deleteImage(existingCollection.image.public_id);
      }

      // Upload new image
      const imageData = await uploadImage(image, "brick_draft/collections");
      updateData.image = imageData;
    } catch (error) {
      return next(new customErrorHandler("Failed to upload image", 500));
    }
  }

  const updatedCollection = await ItemCollection.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCollection) {
    return next(new customErrorHandler("Failed to update collection", 500));
  }

  res.status(200).json({
    success: true,
    updatedCollection,
    message: "Collection updated successfully",
  });
});

//------------------------------------ DELETE COLLECTION => admin/collection/:id ------------------------------------

export const deleteCollectionByID = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const collection = await ItemCollection.findById(id);
  // First check if collection exists
  if (!collection) {
    return next(new customErrorHandler("Collection not found", 404));
  }

  // Delete image from Cloudinary if it exists
  if (collection.image?.public_id) {
    try {
      await deleteImage(collection.image.public_id);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }

  const deletedCollection = await ItemCollection.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    deletedCollection,
    message: "Collection deleted successfully",
  });
});

//------------------------------------ UPLOAD COLLECTION IMAGE => admin/collection/:id/upload_image ------------------------------------

export const uploadCollectionImage = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const { image } = req.body; // Get the single image from the request body

      if (!image) {
        return next(new customErrorHandler("No image provided", 400));
      }

      // Find the collection first to check if it already has an image
      const existingCollection = await ItemCollection.findById(req.params.id);

      if (!existingCollection) {
        return next(new customErrorHandler("Collection not found", 404));
      }

      // If the collection already has an image, delete it from Cloudinary
      if (existingCollection.image && existingCollection.image.public_id) {
        await deleteImage(existingCollection.image.public_id);
        console.log(
          "Deleted previous image:",
          existingCollection.image.public_id
        );
      }

      // Use standardized image upload function
      const imageData = await uploadImage(image, "brick_draft/collections");

      console.log("Uploaded URL:", imageData);

      // Update the collection with the new image URL
      const collection = await ItemCollection.findByIdAndUpdate(
        req.params.id,
        {
          image: imageData,
          updatedBy: req.user.user_id,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: "Collection image updated successfully",
        data: collection,
      });
    } catch (error) {
      return next(
        new customErrorHandler(error.message || "Image upload failed", 500)
      );
    }
  }
);
