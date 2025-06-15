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
