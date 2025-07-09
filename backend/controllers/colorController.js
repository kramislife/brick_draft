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
  const color = await Color.findById(req.params.id);

  if (!color) return next(new customErrorHandler("Color not found", 404));

  res.status(200).json({
    success: true,
    message: "Color retrieved successfully",
    color,
  });
});

//------------------------------------ CREATE NEW COLOR => POST /api/v1/admin/newColor ------------------------------------
export const createColor = catchAsyncErrors(async (req, res, next) => {
  const { color_name = "", hex_code = "" } = req.body;

  if (!color_name.trim() || !hex_code.trim()) {
    return next(
      new customErrorHandler("Color name and hex code are required", 400)
    );
  }

  const existing = await Color.findOne({
    color_name: { $regex: `^${color_name.trim()}$`, $options: "i" },
  });

  if (existing) {
    return next(
      new customErrorHandler(`Color "${color_name}" already exists`, 409)
    );
  }

  const colorData = {
    color_name: color_name.trim(),
    hex_code: hex_code.trim().toLowerCase(),
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

  const color = await Color.findById(id);
  if (!color) return next(new customErrorHandler("Color not found", 404));

  if (color_name?.trim()) color.color_name = color_name.trim();
  if (hex_code?.trim()) color.hex_code = hex_code.trim().toLowerCase();
  color.updated_by = req.user.user_id;

  await color.save();

  res.status(200).json({
    success: true,
    message: "Color updated successfully",
    updatedColor: color,
  });
});

//------------------------------------ DELETE COLOR => DELETE /api/v1/admin/color/:id ------------------------------------
export const deleteColor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const color = await Color.findByIdAndDelete(id);

  if (!color) return next(new customErrorHandler("Color not found", 404));

  res.status(200).json({
    success: true,
    message: "Color deleted successfully",
  });
});
