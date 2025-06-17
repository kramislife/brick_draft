import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import customErrorHandler from "../Utills/custom_error_handler.js";
import LegoItem from "../models/lego_items.model.js";

// CREATE NEW ITEM
export const newItem = catchAsyncErrors(async (req, res, next) => {
  const { name, description, item_images, category, color, item_collection } =
    req.body;
  if (
    !name ||
    !description ||
    !item_images?.length ||
    !category ||
    !color ||
    !item_collection
  ) {
    return next(
      new customErrorHandler("All required fields must be provided.", 400)
    );
  }

  const normalizedCategory = category.toLowerCase();
  if (!["part", "minifigure"].includes(normalizedCategory)) {
    return next(
      new customErrorHandler(
        "Invalid category. Use 'part' or 'minifigure'.",
        400
      )
    );
  }

  // INSERT COMMAND
  const legoItem = new LegoItem({
    name,
    description,
    item_images,
    category: normalizedCategory,
    color,
    item_collection,
  });

  await legoItem.save();

  return res.status(201).json({
    message: "Lego item created successfully",
    item: legoItem,
  });
});

// SELECT ALL ITEMS
export const get_all_items = catchAsyncErrors(async (req, res, next) => {
  const items = await LegoItem.find();
  // .populate("color", "name hex")
  // .populate("collection", "name year");

  return res.status(200).json({
    success: true,
    count: items.length,
    items,
  });
});

// SELECT ITEMS WITH SPECIFIC ID
export const get_single_item = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const item = await LegoItem.findById(id);

  console.log("I AM HERE TOO");

  if (!item) {
    return next(new customErrorHandler("Item not found", 404));
  }

  return res.status(200).json({
    success: true,
    item,
  });
});

// DELETE AN ITEM
export const delete_single_item = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const deleted_item = await LegoItem.findByIdAndDelete(id);

  if (!deleted_item) {
    return next(new customErrorHandler("Item not found", 404));
  }

  return res.status(200).json({
    success: true,
    deleted_item,
  });
});

// UPDATE AN ITEM
export const update_an_item = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const existing_item = await LegoItem.findById(id);

  if (!existing_item) {
    return next(
      new customErrorHandler(`No Lego items found with ID : ${id}`, 404)
    );
  }

  const updated_data = req.body;

  const updated_item = await LegoItem.findByIdAndUpdate(id, updated_data, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "Lego item updated successfully",
    updated_item,
  });
});

// DELETE ALL ITEMS
export const delete_all_items = catchAsyncErrors(async (req, res, next) => {
  const delete_all_items = await LegoItem.deleteMany();

  if (!delete_all_items) {
    return next(new customErrorHandler("Items not deleted", 404));
  }

  return res.status(200).json({
    success: true,
    message: "All items deleted",
    delete_all_items,
  });
});
