// CREATE NEW ITEMS IN THE DATABASE  => post => /api/v1/admin/newitem

import LegoItem from "../models/lego_items.model.js";

export const new_item = async (req, res) => {
  const item = await LegoItem.create(req.body);

  res.status(201).json({
    success: true,
    item,
  });
};

// GET ALL ITEMS FROM THE DATABASE => get => /api/v1/items

export const get_all_items = async (req, res) => {
  const items = await LegoItem.find();

  res.status(200).json({
    success: true,
    items,
  });
};

// GET ITEM BY ID FROM THE DATABASE => get => /api/v1/item/:id

export const get_item_by_id = async (req, res) => {
  const id = req.params.id;
  console.log("Fetching item with ID:", id);
  const item = await LegoItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  res.status(200).json({
    success: true,
    item,
  });
};

// UPDATE ITEM BY ID IN THE DATABASE => put => /api/v1/admin/item/:id

export const update_item_by_id = async (req, res) => {
  const id = req.params.id;
  const update_item_by_id = await LegoItem.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!update_item_by_id) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });

    res.status(200).json({
      success: true,
      update_item_by_id,
    });
  }
};

// DELETE ITEM BY ID FROM THE DATABASE => delete => /api/v1/admin/item/:id

export const delete_item_by_id = async (req, res) => {
  const id = req.params.id;
  const delete_item_by_id = await LegoItem.findByIdAndDelete(id);

  if (!delete_item_by_id) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Item deleted successfully",
    delete_item_by_id,
  });
};

// DELETE ALL ITEMS FROM THE DATABASE => delete => /api/v1/admin/items

export const delete_all_items = async (req, res) => {
  await LegoItem.deleteMany();

  res.status(200).json({
    success: true,
    message: "All items deleted successfully",
  });
};

// UPLOAD ITEM IMAGES => post => /api/v1/admin/item/:id/upload

export const upload_item_images = async (req, res) => {
  const urls = await Promise.all(
    req.body.images.map((image) =>
      uploadImage(image, "brick_draft/item_images")
    )
  );

  const item = await LegoItem.findByIdAndUpdate(
    req.params.id,
    {
      $push: { item_images: { $each: urls } },
    },
    { new: true }
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  res.status(200).json({
    success: true,
    item,
  });
};

// DELETE ITEM IMAGE => delete => /api/v1/admin/item/:id/image/:imageId

const delete_item_image = async (req, res) => {
  const { id } = req.params;
  const { public_id } = req.body;

  if (!public_id) {
    return next(new ErrorHandler("Image ID is required", 400));
  }

  // Check if the item exists
  const item = await LegoItem.findById(id);
  if (!item) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Delete the image from the storage
  const isDeleted = await deleteImage(public_id);

  if (!isDeleted) {
    return next(new ErrorHandler("Failed to delete image from storage", 500));
  }

  const updated_item = await LegoItem.findByIdAndUpdate(
    id,
    { $pull: { item_images: { public_id } } }, // Remove the image with matching `public_id`
    { new: true, runValidators: true }
  );

  if (!updated_item) {
    return next(new ErrorHandler("Failed to update item images", 500));
  }

  return res.status(200).json({
    success: true,
    message: "Image deleted successfully",
    product: updated_item,
  });
};
