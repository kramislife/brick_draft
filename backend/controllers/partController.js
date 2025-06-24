import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import Part from "../models/part.model.js";
import { deleteImage, uploadImage } from "../utills/cloudinary.js";

//------------------------------------ GET ALL PARTS => GET /parts ------------------------------------
export const getParts = catchAsyncErrors(async (req, res, next) => {
  const parts = await Part.find()
    .populate("color", "color_name hex_code")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: `${parts.length} parts retrieved`,
    parts,
  });
});

//------------------------------------ GET PART BY ID => GET /parts/:id ------------------------------------
export const getPartById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const part = await Part.findById(id).populate("color", "color_name hex_code");
  if (!part) {
    return next(new customErrorHandler("Part not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Part retrieved successfully",
    part,
  });
});

// --------------------------------------------------- ADMIN ----------------------------------------------------------

//------------------------------------ CREATE NEW PART => admin/newPart ------------------------------------
export const createPart = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    item_id,
    category,
    category_name,
    weight,
    price,
    quantity,
    color,
    image,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !item_id ||
    !category ||
    !category_name ||
    !weight ||
    !price ||
    !quantity ||
    !color
  ) {
    return next(
      new customErrorHandler("All required fields must be provided", 400)
    );
  }

  // Validate category
  if (!["part", "minifigure"].includes(category.toLowerCase())) {
    return next(
      new customErrorHandler(
        "Category must be either 'part' or 'minifigure'",
        400
      )
    );
  }

  // Check if item_id already exists
  const existingPart = await Part.findOne({ item_id });
  if (existingPart) {
    return next(new customErrorHandler("Part ID already exists", 400));
  }

  // Handle image upload if provided
  let imageData = null;
  if (image) {
    try {
      imageData = await uploadImage(image, "brick_draft/parts");
    } catch (error) {
      return next(new customErrorHandler("Failed to upload image", 500));
    }
  }

  const partData = {
    name,
    item_id,
    category: category.toLowerCase(),
    category_name,
    weight: Number(weight),
    price: Number(price),
    quantity: Number(quantity),
    total_value: Number(price) * Number(quantity),
    color,
    ...(imageData && { item_images: [imageData] }),
    created_by: req.user.user_id,
  };

  const newPart = await Part.create(partData);

  if (!newPart) {
    return next(new customErrorHandler("Failed to create new part", 500));
  }

  res.status(201).json({
    success: true,
    message: "Part created successfully",
    newPart,
  });
});

//------------------------------------ UPDATE PART => admin/parts/:id ------------------------------------
export const updatePart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    item_id,
    category,
    category_name,
    weight,
    price,
    quantity,
    color,
    image,
  } = req.body;

  // Get the existing part first
  const existingPart = await Part.findById(id);
  if (!existingPart) {
    return next(new customErrorHandler("Part not found", 404));
  }

  // Check if item_id already exists (excluding current part)
  if (item_id && item_id !== existingPart.item_id) {
    const duplicatePart = await Part.findOne({ item_id });
    if (duplicatePart) {
      return next(new customErrorHandler("Part ID already exists", 400));
    }
  }

  // Validate category if provided
  if (category && !["part", "minifigure"].includes(category.toLowerCase())) {
    return next(
      new customErrorHandler(
        "Category must be either 'part' or 'minifigure'",
        400
      )
    );
  }

  const updateData = {
    name,
    item_id,
    ...(category && { category: category.toLowerCase() }),
    category_name,
    weight: Number(weight),
    price: Number(price),
    quantity: Number(quantity),
    total_value: Number(price) * Number(quantity),
    color,
    updated_by: req.user.user_id,
  };

  // Only process the image if it's a new base64 string
  if (image && typeof image === "string" && image.startsWith("data:image")) {
    try {
      // Delete old image if it exists
      if (existingPart.item_images?.[0]?.public_id) {
        await deleteImage(existingPart.item_images[0].public_id);
      }

      // Upload new image
      const imageData = await uploadImage(image, "brick_draft/parts");
      updateData.item_images = [imageData];
    } catch (error) {
      return next(new customErrorHandler("Failed to upload image", 500));
    }
  }

  const updatedPart = await Part.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedPart) {
    return next(new customErrorHandler("Failed to update part", 500));
  }

  res.status(200).json({
    success: true,
    updatedPart,
    message: "Part updated successfully",
  });
});

//------------------------------------ DELETE PART => admin/parts/:id ------------------------------------
export const deletePartById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const part = await Part.findById(id);
  // First check if part exists
  if (!part) {
    return next(new customErrorHandler("Part not found", 404));
  }

  // Delete image from Cloudinary if it exists
  if (part.item_images?.[0]?.public_id) {
    try {
      await deleteImage(part.item_images[0].public_id);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }

  const deletedPart = await Part.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    deletedPart,
    message: "Part deleted successfully",
  });
});
