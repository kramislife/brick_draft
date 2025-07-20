import PriorityList from "../models/priority_list.model.js";
import Ticket from "../models/ticket.model.js";
import Lottery from "../models/lottery.model.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import { processDataWithFilters } from "../utills/searchSortPagination.js";

// ==================== HELPER FUNCTIONS ====================
// Using utility functions from searchSortPagination.js

// ==================== VALIDATION HELPERS ====================

// Validate purchase ownership and get ticket data
const validatePurchaseOwnership = async (userId, purchaseId) => {
  const ticket = await Ticket.findOne({
    purchase_id: purchaseId,
    user_id: userId,
  });
  if (!ticket) {
    throw new customErrorHandler(
      "Purchase not found or not owned by user",
      404
    );
  }
  return ticket;
};

// Validate lottery exists and get lottery data
const validateLotteryExists = async (lotteryId) => {
  const lottery = await Lottery.findById(lotteryId);
  if (!lottery) {
    throw new customErrorHandler("Lottery not found", 404);
  }
  return lottery;
};

// Validate priority items structure and content
const validatePriorityItems = (priorityItems, lottery, isUpdate = false) => {
  if (!Array.isArray(priorityItems)) {
    throw new customErrorHandler("Priority items must be an array", 400);
  }

  // Allow empty arrays for updates (user can clear all items)
  if (priorityItems.length === 0 && !isUpdate) {
    throw new customErrorHandler("Select at least one part", 400);
  }

  for (const item of priorityItems) {
    if (!item.item || typeof item.priority !== "number") {
      throw new customErrorHandler(
        "Each priority item must have an item and a priority number",
        400
      );
    }

    // Check that the part exists in the lottery's parts
    if (!lottery.parts.some((p) => p.part.toString() === item.item)) {
      throw new customErrorHandler("Part does not belong to this lottery", 400);
    }
  }
};

// Check if priority list exists
const checkPriorityListExists = async (
  userId,
  purchaseId,
  shouldExist = true
) => {
  const existingPriorityList = await PriorityList.findOne({
    user: userId,
    purchaseId,
  });

  if (shouldExist && !existingPriorityList) {
    throw new customErrorHandler(
      "Priority list not found. Use POST to create.",
      404
    );
  }

  if (!shouldExist && existingPriorityList) {
    throw new customErrorHandler(
      "Priority list already exists. Use PUT to update.",
      409
    );
  }

  return existingPriorityList;
};

// ==================== DATA PROCESSING HELPERS ====================

// Process lottery parts with additional data
const processLotteryParts = (lottery) => {
  return (lottery.parts || []).map((p) => {
    const part = p.part.toObject ? p.part.toObject() : p.part;
    return {
      ...part,
      quantity: p.quantity,
      total_value: p.total_value,
      price: p.price,
    };
  });
};

// Populate priority list with additional data
const populatePriorityList = async (priorityList, lottery) => {
  if (!priorityList || !priorityList.priorityItems) return priorityList;

  const populatedList = await PriorityList.findById(priorityList._id).populate({
    path: "priorityItems.item",
    model: "Part",
    populate: { path: "color", select: "color_name hex_code" },
  });

  // Convert to plain object if it's a Mongoose document
  const priorityListObj = populatedList.toObject
    ? populatedList.toObject()
    : populatedList;

  // Attach quantity and total_value to each priority item's part
  priorityListObj.priorityItems = priorityListObj.priorityItems.map((item) => {
    const lotteryPart = (lottery.parts || []).find(
      (p) => p.part._id.toString() === item.item._id.toString()
    );
    return {
      ...item,
      item: {
        ...item.item,
        quantity: lotteryPart ? lotteryPart.quantity : undefined,
        total_value: lotteryPart ? lotteryPart.total_value : undefined,
        price: lotteryPart ? lotteryPart.price : undefined,
      },
    };
  });

  return priorityListObj;
};

// ==================== CONTROLLER FUNCTIONS ====================

// Get priority list
export const getPriorityList = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user_id;
  const { purchaseId } = req.params;
  const { search, sort, color, category, page = 1, limit } = req.query;

  // Validate purchase ownership
  const ticket = await validatePurchaseOwnership(userId, purchaseId);
  const lotteryId = ticket.lottery.lottery_id;

  // Validate lottery exists and populate parts
  const lottery = await Lottery.findById(lotteryId).populate({
    path: "parts.part",
    populate: { path: "color", select: "color_name hex_code" },
  });
  if (!lottery) {
    return next(new customErrorHandler("Lottery not found", 404));
  }

  // Process lottery parts
  const parts = processLotteryParts(lottery);

  // Use the optimized utility function for all processing
  const {
    processedData: paginatedParts,
    totalItems: totalParts,
    totalPages,
    currentPage: pageNum,
    hasNextPage,
    hasPrevPage,
    startEntry,
    endEntry,
    availableCategories,
    availableColors,
  } = processDataWithFilters(parts, {
    search,
    sort,
    color,
    category,
    page,
    limit,
  });

  // Get and populate priority list
  let priorityList = await PriorityList.findOne({
    user: userId,
    purchaseId,
  });
  priorityList = await populatePriorityList(priorityList, lottery);

  res.status(200).json({
    success: true,
    priorityList,
    parts: paginatedParts,
    totalParts,
    totalAllParts: parts.length,
    totalPages,
    page: pageNum,
    hasNextPage,
    hasPrevPage,
    startEntry,
    endEntry,
    availableCategories,
    availableColors,
    isSelectAllMode: limit === "all",
  });
});

// Create priority list
export const createPriorityList = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user_id;
  const { purchaseId } = req.params;
  const { priorityItems } = req.body;

  // Validate purchase ownership
  const ticket = await validatePurchaseOwnership(userId, purchaseId);
  const lotteryId = ticket.lottery.lottery_id;

  // Validate lottery exists
  const lottery = await validateLotteryExists(lotteryId);

  // Check priority list doesn't exist
  await checkPriorityListExists(userId, purchaseId, false);

  // Validate priority items
  validatePriorityItems(priorityItems, lottery, false);

  // Create the priority list
  const newPriorityList = await PriorityList.create({
    user: userId,
    lottery: lotteryId,
    purchaseId,
    priorityItems,
    createdBy: userId,
  });

  // Populate and return
  const populatedPriorityList = await populatePriorityList(
    newPriorityList,
    lottery
  );

  res.status(201).json({
    success: true,
    priorityList: populatedPriorityList,
    message: "Priority list created successfully",
  });
});

// Update priority list
export const updatePriorityList = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user_id;
  const { purchaseId } = req.params;
  const { priorityItems } = req.body;

  // Validate purchase ownership
  const ticket = await validatePurchaseOwnership(userId, purchaseId);
  const lotteryId = ticket.lottery.lottery_id;

  // Validate lottery exists
  const lottery = await validateLotteryExists(lotteryId);

  // Check priority list exists
  await checkPriorityListExists(userId, purchaseId, true);

  // Validate priority items
  validatePriorityItems(priorityItems, lottery, true);

  // Update the priority list
  const updated = await PriorityList.findOneAndUpdate(
    { user: userId, lottery: lotteryId, purchaseId },
    {
      priorityItems,
      updatedBy: userId,
    },
    { new: true }
  );

  // Populate and return
  const populatedPriorityList = await populatePriorityList(updated, lottery);

  res.status(200).json({
    success: true,
    priorityList: populatedPriorityList,
    message: "Priority list updated successfully",
  });
});

// Delete priority list
export const deletePriorityList = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user_id;
  const { purchaseId } = req.params;

  // Validate purchase ownership
  await validatePurchaseOwnership(userId, purchaseId);

  // Check priority list exists
  await checkPriorityListExists(userId, purchaseId, true);

  // Delete the priority list
  await PriorityList.findOneAndDelete({
    user: userId,
    purchaseId,
  });

  res.status(200).json({
    success: true,
    message: "Priority list deleted successfully",
  });
});
