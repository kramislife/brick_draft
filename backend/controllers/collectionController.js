import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

//------------------------------------ GET ALL COLLECTIONS => GET /collections ------------------------------------
export const getAllCollections = catchAsyncErrors(async (req, res, next) => {
  const collections = await ItemCollection.find().sort({ popularityId: 1 });

  if (collections.length === 0) {
    return next(
      new customErrorHandler("Failed to retrieve all collections", 404)
    );
  }

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
  const newCollection = await ItemCollection.create(req?.body);

  if (!newCollection) {
    return next(new customErrorHandler("Failed to create new collection", 404));
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
  const updatedData = { ...req.body };

  // Get the existing collection first
  const existingCollection = await ItemCollection.findById(id);
  if (!existingCollection) {
    return next(new customErrorHandler("Collection not found", 404));
  }

  // Preserve the image if it's not being updated
  if (!updatedData.image && existingCollection.image) {
    updatedData.image = existingCollection.image;
  }

  const updatedCollection = await ItemCollection.findByIdAndUpdate(
    id,
    updatedData,
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

  const deletedCollection = await ItemCollection.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    deletedCollection,
    message: "Collection deleted successfully",
  });
});

//------------------------------------ UPLOAD COLLECTION => admin/collection/:id/upload_image ------------------------------------

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
      const url = await uploadImage(image, "brick_draft/collections");

      console.log("Uploaded URL:", url);

      // Update the collection with the new image URL
      const collection = await ItemCollection.findByIdAndUpdate(
        req.params.id,
        { image: url }, // Update operation
        { new: true, runValidators: true } // Options
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
