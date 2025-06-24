import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Color from "../models/color.model.js";
import customErrorHandler from "../utills/custom_error_handler.js";

//------------------------------------ GET ALL COLORS => GET /api/v1/colors ------------------------------------
export const getAllColors = catchAsyncErrors(async (req, res, next) => {
  const colors = await Color.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: `${colors.length} colors retrieved`,
    colors,
  });
});

//------------------------------------ GET COLOR BY ID => GET /api/v1/color/:id ------------------------------------
export const getColorById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const color = await Color.findById(id);
  if (!color) {
    return next(new customErrorHandler("Color not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Color retrieved successfully",
    color,
  });
});

// --------------------------------------------------- ADMIN ----------------------------------------------------------

//------------------------------------ CREATE NEW COLOR => POST /api/v1/admin/newColor ------------------------------------
export const createColor = catchAsyncErrors(async (req, res, next) => {
  const { color_name, hex_code } = req.body;

  if (!color_name || !hex_code) {
    return next(
      new customErrorHandler("Color name and hex code are required", 400)
    );
  }

  const colorData = {
    color_name,
    hex_code,
    created_by: req.user.user_id,
  };

  const newColor = await Color.create(colorData);

  res.status(201).json({
    success: true,
    message: "Color created successfully",
    newColor,
  });
});

//------------------------------------ UPDATE COLOR => PUT /api/v1/admin/colors/:id ------------------------------------
export const updateColor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { color_name, hex_code } = req.body;

  const updateData = {
    color_name,
    hex_code,
    updated_by: req.user.user_id,
  };

  const updatedColor = await Color.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedColor) {
    return next(new customErrorHandler("Color not found", 404));
  }

  res.status(200).json({
    success: true,
    updatedColor,
    message: "Color updated successfully",
  });
});

//------------------------------------ DELETE COLOR => DELETE /api/v1/admin/color/:id ------------------------------------
export const deleteColor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const color = await Color.findByIdAndDelete(id);

  if (!color) {
    return next(new customErrorHandler("Color not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Color deleted successfully",
  });
});
