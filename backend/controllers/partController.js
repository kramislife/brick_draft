import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import Part from "../models/part.model.js";
import { deleteImage, uploadImage } from "../utills/cloudinary.js";
import Lottery from "../models/lottery.model.js";

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
  const part = await Part.findById(req.params.id).populate(
    "color",
    "color_name hex_code"
  );

  if (!part) {
    return next(new customErrorHandler("Part not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Part retrieved successfully",
    part,
  });
});

//------------------------------------ CREATE NEW PART => POST /admin/newPart ------------------------------------
export const createPart = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    part_id,
    item_id,
    category,
    category_name,
    weight,
    color,
    image,
  } = req.body;

  if (!name || !part_id || !item_id || !category || !category_name || !color) {
    return next(new customErrorHandler("Required fields missing", 400));
  }

  if (!["part", "minifigure"].includes(category.toLowerCase())) {
    return next(
      new customErrorHandler("Category must be 'part' or 'minifigure'", 400)
    );
  }

  const existing = await Part.findOne({ item_id });
  if (existing) {
    return next(
      new customErrorHandler("Part with this item_id already exists", 409)
    );
  }

  let imageData = null;
  if (image) {
    try {
      imageData = await uploadImage(image, "brick_draft/parts");
    } catch (err) {
      return next(new customErrorHandler("Failed to upload image", 500));
    }
  }

  const partData = {
    name: name.trim(),
    part_id: part_id.trim(),
    item_id: item_id.trim(),
    category: category.toLowerCase(),
    category_name: category_name.trim(),
    weight: weight ? Number(weight) : 0,
    color,
    ...(imageData && { item_image: imageData }),
    created_by: req.user.user_id,
  };

  const newPart = await Part.create(partData);

  res.status(201).json({
    success: true,
    message: "Part created successfully",
    newPart,
    description: `${newPart.name} has been added to parts.`,
  });
});

//------------------------------------ UPDATE PART => PUT /admin/parts/:id ------------------------------------
export const updatePart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    part_id,
    item_id,
    category,
    category_name,
    weight,
    color,
    image,
  } = req.body;

  const part = await Part.findById(id);
  if (!part) return next(new customErrorHandler("Part not found", 404));

  if (item_id && item_id !== part.item_id) {
    const duplicate = await Part.findOne({ item_id });
    if (duplicate) {
      return next(
        new customErrorHandler("Part with this item_id already exists", 409)
      );
    }
  }

  const updateData = {
    name: name?.trim(),
    part_id: part_id?.trim(),
    item_id: item_id?.trim(),
    category: category ? category.toLowerCase() : undefined,
    category_name: category_name?.trim(),
    weight: weight !== undefined ? Number(weight) : undefined,
    color,
    updated_by: req.user.user_id,
  };

  // Handle new image
  if (image && typeof image === "string" && image.startsWith("data:image")) {
    try {
      if (part.item_image?.public_id) {
        await deleteImage(part.item_image.public_id);
      }
      const imageData = await uploadImage(image, "brick_draft/parts");
      updateData.item_image = imageData;
    } catch (err) {
      return next(new customErrorHandler("Failed to upload new image", 500));
    }
  }

  const updatedPart = await Part.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    updatedPart,
    message: "Part updated successfully",
    description: `${updatedPart.name} has been updated.`,
  });
});

//------------------------------------ DELETE PART => DELETE /admin/parts/:id ------------------------------------
export const deletePartById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const part = await Part.findById(id);
  if (!part) {
    return next(new customErrorHandler("Part not found", 404));
  }

  if (part.item_image?.public_id) {
    try {
      await deleteImage(part.item_image.public_id);
    } catch (err) {
      console.error("Image deletion failed:", err);
    }
  }

  await Part.findByIdAndDelete(id);

  // Remove the part from all lotteries' parts arrays
  await Lottery.updateMany({}, { $pull: { parts: { part: part._id } } });

  res.status(200).json({
    success: true,
    message: "Part deleted successfully",
    description: `${part.name} has been deleted and removed from all lotteries.`,
  });
});
