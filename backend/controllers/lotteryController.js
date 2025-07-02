import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Lottery from "../models/lottery.model.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import { uploadImage, deleteImage } from "../utills/cloudinary.js";

// GET ALL LOTTERIES
export const getAllLotteries = catchAsyncErrors(async (req, res, next) => {
  const lotteries = await Lottery.find()
    .populate("collection", "name")
    .populate({
      path: "parts",
      select:
        "name part_id item_id color item_images category category_name weight price quantity total_value",
      populate: {
        path: "color",
        select: "color_name hex_code",
      },
    })
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: `${lotteries.length} lotteries retrieved`,
    lotteries,
  });
});

// GET LOTTERY BY ID
export const getLotteryById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const lottery = await Lottery.findById(id)
    .populate("collection", "name")
    .populate({
      path: "parts",
      select:
        "name part_id item_id color item_images category category_name weight price quantity total_value",
      populate: {
        path: "color",
        select: "color_name hex_code",
      },
    });
  if (!lottery) {
    return next(new customErrorHandler("Lottery not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Lottery retrieved successfully",
    lottery,
  });
});

// CREATE LOTTERY
export const createLottery = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    whyCollect,
    ticketPrice,
    marketPrice,
    drawDate,
    drawTime,
    totalSlots,
    pieces,
    collection,
    tag,
    parts,
    image,
  } = req.body;

  if (
    !title ||
    !description ||
    !whyCollect ||
    whyCollect.length === 0 ||
    !ticketPrice ||
    !marketPrice ||
    !drawDate ||
    !drawTime ||
    !totalSlots ||
    !pieces ||
    !collection ||
    !tag ||
    !parts ||
    parts.length === 0
  ) {
    return next(
      new customErrorHandler("All required fields must be provided", 400)
    );
  }
  if (whyCollect.length > 3) {
    return next(
      new customErrorHandler("Maximum 3 reasons for whyCollect", 400)
    );
  }

  let imageData = null;
  if (image && typeof image === "string" && image.startsWith("data:image")) {
    try {
      imageData = await uploadImage(image, "brick_draft/lotteries");
    } catch (error) {
      return next(new customErrorHandler("Failed to upload image", 500));
    }
  }

  const lotteryData = {
    title,
    description,
    whyCollect,
    ticketPrice,
    marketPrice,
    drawDate,
    drawTime,
    totalSlots,
    pieces,
    collection,
    tag,
    parts,
    ...(imageData && { image: imageData }),
    createdBy: req.user.user_id,
  };

  const newLottery = await Lottery.create(lotteryData);
  if (!newLottery) {
    return next(new customErrorHandler("Failed to create new lottery", 500));
  }
  res.status(201).json({
    success: true,
    message: "Lottery created successfully",
    newLottery,
  });
});

// UPDATE LOTTERY
export const updateLottery = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    whyCollect,
    ticketPrice,
    marketPrice,
    drawDate,
    drawTime,
    totalSlots,
    pieces,
    collection,
    tag,
    parts,
    image,
  } = req.body;

  const existingLottery = await Lottery.findById(id);
  if (!existingLottery) {
    return next(new customErrorHandler("Lottery not found", 404));
  }
  if (whyCollect && whyCollect.length > 3) {
    return next(
      new customErrorHandler("Maximum 3 reasons for whyCollect", 400)
    );
  }

  const updateData = {
    title,
    description,
    whyCollect,
    ticketPrice,
    marketPrice,
    drawDate,
    drawTime,
    totalSlots,
    pieces,
    collection,
    tag,
    parts,
    modifiedBy: req.user.user_id,
  };

  if (image && typeof image === "string" && image.startsWith("data:image")) {
    try {
      if (existingLottery.image?.public_id) {
        await deleteImage(existingLottery.image.public_id);
      }
      const imageData = await uploadImage(image, "brick_draft/lotteries");
      updateData.image = imageData;
    } catch (error) {
      return next(new customErrorHandler("Failed to upload image", 500));
    }
  }

  const updatedLottery = await Lottery.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedLottery) {
    return next(new customErrorHandler("Failed to update lottery", 500));
  }
  res.status(200).json({
    success: true,
    updatedLottery,
    message: "Lottery updated successfully",
  });
});

// DELETE LOTTERY
export const deleteLottery = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const lottery = await Lottery.findById(id);
  if (!lottery) {
    return next(new customErrorHandler("Lottery not found", 404));
  }
  if (lottery.image?.public_id) {
    try {
      await deleteImage(lottery.image.public_id);
    } catch (error) {
      // log but don't block deletion
    }
  }
  const deletedLottery = await Lottery.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    deletedLottery,
    message: "Lottery deleted successfully",
  });
});

export const getLotteryPartsWithQuery = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { search, sort, color, category, page = 1, limit } = req.query;

    // Find the lottery and populate parts
    const lottery = await Lottery.findById(id).populate({
      path: "parts",
      populate: { path: "color", select: "color_name hex_code" },
    });

    if (!lottery) {
      return next(new customErrorHandler("Lottery not found", 404));
    }

    let parts = lottery.parts;

    // Filter: search
    if (search) {
      const searchLower = search.toLowerCase();
      parts = parts.filter(
        (part) =>
          part.name.toLowerCase().includes(searchLower) ||
          (part.part_id && part.part_id.toLowerCase().includes(searchLower)) ||
          (part.item_id && part.item_id.toLowerCase().includes(searchLower)) ||
          (part.category_name &&
            part.category_name.toLowerCase().includes(searchLower)) ||
          (part.color &&
            part.color.color_name.toLowerCase().includes(searchLower))
      );
    }

    // Filter: color
    if (color) {
      parts = parts.filter(
        (part) => part.color && part.color._id.toString() === color
      );
    }

    // Filter: category
    if (category) {
      parts = parts.filter(
        (part) => part.category_name && part.category_name === category
      );
    }

    // Sort
    if (sort) {
      if (sort === "name") {
        parts = parts.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === "-name") {
        parts = parts.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sort === "part_id") {
        parts = parts.sort((a, b) =>
          (a.part_id || "").localeCompare(b.part_id || "")
        );
      } else if (sort === "-part_id") {
        parts = parts.sort((a, b) =>
          (b.part_id || "").localeCompare(a.part_id || "")
        );
      } else if (sort === "quantity") {
        parts = parts.sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
      } else if (sort === "-quantity") {
        parts = parts.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
      } else if (sort === "total_value") {
        parts = parts.sort(
          (a, b) => (a.total_value || 0) - (b.total_value || 0)
        );
      } else if (sort === "-total_value") {
        parts = parts.sort(
          (a, b) => (b.total_value || 0) - (a.total_value || 0)
        );
      } else if (sort === "date") {
        parts = parts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      } else if (sort === "-date") {
        parts = parts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
    }

    // Pagination
    const totalParts = parts.length;
    const pageNum = parseInt(page, 10) || 1;

    // Handle "all" case (when limit is undefined)
    let paginatedParts, totalPages;
    if (limit === undefined || limit === "all") {
      // Return all parts without pagination
      paginatedParts = parts;
      totalPages = 1;
    } else {
      // Apply pagination
      const limitNum = parseInt(limit, 10) || 10;
      totalPages = Math.ceil(totalParts / limitNum);
      const startIdx = (pageNum - 1) * limitNum;
      paginatedParts = parts.slice(startIdx, startIdx + limitNum);
    }

    res.status(200).json({
      success: true,
      count: paginatedParts.length,
      totalParts,
      totalPages,
      page: pageNum,
      parts: paginatedParts,
    });
  }
);
