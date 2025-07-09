import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import { uploadImage, deleteImage } from "../utills/cloudinary.js";
import Lottery from "../models/lottery.model.js";
import Part from "../models/part.model.js";
import Color from "../models/color.model.js";

// validate lottery data
const validateLotteryData = (data) => {
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
  } = data;

  if (
    !title ||
    !description ||
    !whyCollect ||
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
    throw new customErrorHandler("All required fields must be provided", 400);
  }

  if (whyCollect.length > 3) {
    throw new customErrorHandler("Maximum 3 reasons for whyCollect", 400);
  }
};

// process image upload
const processImageUpload = async (image, existingImage = null) => {
  if (image && typeof image === "string" && image.startsWith("data:image")) {
    if (existingImage?.public_id) {
      await deleteImage(existingImage.public_id);
    }
    return await uploadImage(image, "brick_draft/lotteries");
  }
  return image || existingImage;
};

// find or create color
const findOrCreateColor = async (colorName, userId) => {
  let colorDoc = await Color.findOne({
    color_name: { $regex: `^${colorName.trim()}$`, $options: "i" },
  });

  if (!colorDoc) {
    try {
      colorDoc = await Color.create({
        color_name: colorName.trim(),
        hex_code: "#000000", // default color, admin can edit later
        created_by: userId,
      });
    } catch (err) {
      // If duplicate error, try to find the color again
      if (err.code === 11000) {
        colorDoc = await Color.findOne({
          color_name: { $regex: `^${colorName.trim()}$`, $options: "i" },
        });
      } else {
        console.warn(`Skipped color '${colorName}': ${err.message}`);
        return null;
      }
    }
  }

  return colorDoc;
};

// clean weight value
const cleanWeightValue = (weight) => {
  if (!weight) return 0;
  const match = String(weight).replace(/[^0-9.\-]/g, "");
  return match ? Number(match) : 0;
};

// find or create part
const findOrCreatePart = async (csvPart, colorDoc, userId) => {
  const cleanWeight = cleanWeightValue(csvPart.weight);

  let partDoc = await Part.findOne({ item_id: csvPart.item_id.trim() });
  if (!partDoc) {
    try {
      partDoc = await Part.create({
        name: csvPart.name.trim(),
        part_id: csvPart.part_id.trim(),
        item_id: csvPart.item_id.trim(),
        category: csvPart.category ? csvPart.category.toLowerCase() : "part",
        category_name: csvPart.category_name
          ? csvPart.category_name.trim()
          : "Part",
        weight: cleanWeight,
        color: colorDoc._id,
        item_image: csvPart.item_image || undefined, // If present in CSV, else undefined
        created_by: userId,
      });
      return { part: partDoc, created: true };
    } catch (err) {
      console.warn(`Skipped part '${csvPart.item_id}': ${err.message}`);
      return { part: null, created: false, skipped: true };
    }
  }

  return { part: partDoc, created: false, skipped: true };
};

// process parts from CSV
const processPartsFromCSV = async (parts, userId) => {
  let createdCount = 0;
  let skippedCount = 0;
  const partRefs = [];

  for (const csvPart of parts) {
    // Find or create color
    const colorDoc = await findOrCreateColor(csvPart.color, userId);
    if (!colorDoc) {
      skippedCount++;
      continue;
    }

    // Find or create part
    const {
      part: partDoc,
      created,
      skipped,
    } = await findOrCreatePart(csvPart, colorDoc, userId);

    if (partDoc) {
      partRefs.push({ part: partDoc._id });
      if (created) createdCount++;
      if (skipped) skippedCount++;
    } else {
      skippedCount++;
    }
  }

  return { partRefs, createdCount, skippedCount };
};

// populate lottery with parts
const populateLotteryWithParts = (lottery) => {
  return lottery.populate([
    { path: "collection", select: "name" },
    {
      path: "parts.part",
      populate: { path: "color", select: "color_name hex_code" },
    },
  ]);
};

// GET ALL LOTTERIES
export const getAllLotteries = catchAsyncErrors(async (req, res, next) => {
  const lotteries = await Lottery.find()
    .populate("collection", "name")
    .populate({
      path: "parts.part",
      populate: { path: "color", select: "color_name hex_code" },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: `${lotteries.length} lotteries retrieved`,
    lotteries,
  });
});

// GET LOTTERY BY ID WITH PARTS
export const getLotteryById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const lottery = await populateLotteryWithParts(Lottery.findById(id)).lean();

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
  try {
    // Validate input data
    validateLotteryData(req.body);

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

    // Process image upload
    const imageData = await processImageUpload(image);

    // Process parts from CSV
    const { partRefs, createdCount, skippedCount } = await processPartsFromCSV(
      parts,
      req.user.user_id
    );

    // Create the lottery
    const lottery = await Lottery.create({
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
      image: imageData,
      createdBy: req.user.user_id,
      parts: partRefs,
    });

    res.status(201).json({
      success: true,
      message: "Lottery created successfully",
      lottery,
      description: `Processed ${parts.length} parts: ${createdCount} (new), ${skippedCount} (duplicates).`,
    });
  } catch (error) {
    if (error instanceof customErrorHandler) {
      return next(error);
    }
    return next(new customErrorHandler(error.message, 500));
  }
});

// UPDATE LOTTERY
export const updateLottery = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const lottery = await Lottery.findById(id);
    if (!lottery) {
      return next(new customErrorHandler("Lottery not found", 404));
    }

    // Validate whyCollect if provided
    if (updateData.whyCollect && updateData.whyCollect.length > 3) {
      return next(
        new customErrorHandler("Maximum 3 reasons for whyCollect", 400)
      );
    }

    // Process image upload
    const imageData = await processImageUpload(updateData.image, lottery.image);

    // Process parts if provided
    let partRefs = lottery.parts || [];
    if (updateData.parts) {
      const { partRefs: newPartRefs } = await processPartsFromCSV(
        updateData.parts,
        req.user.user_id
      );
      partRefs = newPartRefs;
    }

    // Update lottery
    const updatedLottery = await Lottery.findByIdAndUpdate(
      id,
      {
        ...updateData,
        image: imageData,
        updatedBy: req.user.user_id,
        parts: partRefs,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Lottery updated successfully",
      updatedLottery,
    });
  } catch (error) {
    if (error instanceof customErrorHandler) {
      return next(error);
    }
    return next(new customErrorHandler(error.message, 500));
  }
});

// DELETE LOTTERY
export const deleteLottery = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const lottery = await Lottery.findById(id);
  if (!lottery) {
    return next(new customErrorHandler("Lottery not found", 404));
  }

  // Delete associated image
  if (lottery.image?.public_id) {
    await deleteImage(lottery.image.public_id);
  }

  // Delete the lottery
  await Lottery.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Lottery deleted successfully",
  });
});

// GET LOTTERY PARTS WITH QUERY (All logic handled server-side)
export const getLotteryPartsWithQuery = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { search, sort, color, category, page = 1, limit } = req.query;

    // Find the lottery and populate parts
    const lottery = await populateLotteryWithParts(Lottery.findById(id));

    if (!lottery) {
      return next(new customErrorHandler("Lottery not found", 404));
    }

    // Extract part objects from the parts array
    let parts = (lottery.parts || []).map((p) => p.part);

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      parts = parts.filter(
        (part) =>
          part.name?.toLowerCase().includes(searchLower) ||
          (part.part_id && part.part_id.toLowerCase().includes(searchLower)) ||
          (part.item_id && part.item_id.toLowerCase().includes(searchLower)) ||
          (part.category_name &&
            part.category_name.toLowerCase().includes(searchLower)) ||
          (part.color &&
            part.color.color_name.toLowerCase().includes(searchLower))
      );
    }

    // Apply color filter
    if (color) {
      parts = parts.filter(
        (part) => part.color && part.color._id.toString() === color
      );
    }

    // Apply category filter
    if (category) {
      parts = parts.filter(
        (part) => part.category_name && part.category_name === category
      );
    }

    // Apply sorting
    if (sort) {
      const sortFunctions = {
        name: (a, b) => a.name.localeCompare(b.name),
        "-name": (a, b) => b.name.localeCompare(a.name),
        part_id: (a, b) => (a.part_id || "").localeCompare(b.part_id || ""),
        "-part_id": (a, b) => (b.part_id || "").localeCompare(a.part_id || ""),
        quantity: (a, b) => (a.quantity || 0) - (b.quantity || 0),
        "-quantity": (a, b) => (b.quantity || 0) - (a.quantity || 0),
        total_value: (a, b) => (a.total_value || 0) - (b.total_value || 0),
        "-total_value": (a, b) => (b.total_value || 0) - (a.total_value || 0),
        date: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        "-date": (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      };

      const sortFunction = sortFunctions[sort];
      if (sortFunction) {
        parts = parts.sort(sortFunction);
      }
    }

    // Apply pagination
    const totalParts = parts.length;
    const pageNum = parseInt(page, 10) || 1;

    let paginatedParts, totalPages;
    if (limit === undefined || limit === "all") {
      paginatedParts = parts;
      totalPages = 1;
    } else {
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
