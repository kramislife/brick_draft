import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import { uploadImage, deleteImage } from "../utills/cloudinary.js";
import Lottery from "../models/lottery.model.js";
import Part from "../models/part.model.js";
import Color from "../models/color.model.js";

// ==================== VALIDATION HELPERS ====================

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

// validate whyCollect length
const validateWhyCollect = (whyCollect) => {
  if (whyCollect && whyCollect.length > 3) {
    throw new customErrorHandler("Maximum 3 reasons for whyCollect", 400);
  }
};

// ==================== IMAGE PROCESSING HELPERS ====================

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

// ==================== COLOR & PART HELPERS ====================

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

// clean price value
const cleanPriceValue = (price) => {
  if (!price) return 0;
  const match = String(price).replace(/[^0-9.-]+/g, "");
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
        item_image: csvPart.item_image || undefined,
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
      const price = cleanPriceValue(csvPart.price || csvPart.part?.price);
      const quantity = Number(csvPart.quantity || csvPart.part?.quantity) || 0;
      const total_value = price * quantity;
      partRefs.push({
        part: partDoc._id,
        price,
        quantity,
        total_value,
      });
      if (created) createdCount++;
      if (skipped) skippedCount++;
    } else {
      skippedCount++;
    }
  }

  return { partRefs, createdCount, skippedCount };
};

// ==================== POPULATION HELPERS ====================

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

// ==================== FORMATTING HELPERS ====================

// format draw date for display
const formatDrawDate = (dateString) => {
  if (!dateString) return "TBD";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "TBD";
  }
};

// format draw time for display with EST timezone
const formatDrawTime = (timeString) => {
  if (!timeString) return "";
  try {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return (
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) + " EST"
    );
  } catch {
    return "";
  }
};

// format tag for display
const formatTagForDisplay = (tag) => {
  if (!tag) return [];
  return [tag.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())];
};

// format lottery data for frontend
const formatLotteryForFrontend = (lottery) => ({
  ...lottery,
  formattedDrawDate: formatDrawDate(lottery.drawDate),
  formattedDrawTime: formatDrawTime(lottery.drawTime),
  formattedTag: formatTagForDisplay(lottery.tag),
});

// ==================== SORTING HELPERS ====================

// sort lotteries based on criteria
const sortLotteries = (lotteries, sortBy) => {
  if (!sortBy) {
    return lotteries.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  const sortFunctions = {
    Featured: (a, b) =>
      b.tag?.includes("featured") - a.tag?.includes("featured"),
    "Best Seller": (a, b) =>
      b.tag?.includes("best_seller") - a.tag?.includes("best_seller"),
    "New Arrival": (a, b) =>
      b.tag?.includes("new_arrival") - a.tag?.includes("new_arrival"),
    "Limited Edition": (a, b) =>
      b.tag?.includes("limited_edition") - a.tag?.includes("limited_edition"),
    "Ending Soon": (a, b) => new Date(a.drawDate) - new Date(b.drawDate),
    "Draw Date": (a, b) => new Date(a.drawDate) - new Date(b.drawDate),
    "Newly Added": (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    "Price: Low to High": (a, b) => a.ticketPrice - b.ticketPrice,
    "Price: High to Low": (a, b) => b.ticketPrice - a.ticketPrice,
  };

  const sortFunction = sortFunctions[sortBy];
  return sortFunction
    ? lotteries.sort(sortFunction)
    : lotteries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// sort parts based on criteria
const sortParts = (parts, sort) => {
  if (!sort) return parts;

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
  return sortFunction ? parts.sort(sortFunction) : parts;
};

// ==================== FILTERING HELPERS ====================

// filter parts by search term
const filterPartsBySearch = (parts, search) => {
  if (!search) return parts;

  const searchLower = search.toLowerCase();
  return parts.filter(
    (part) =>
      part.name?.toLowerCase().includes(searchLower) ||
      (part.part_id && part.part_id.toLowerCase().includes(searchLower)) ||
      (part.item_id && part.item_id.toLowerCase().includes(searchLower)) ||
      (part.category_name &&
        part.category_name.toLowerCase().includes(searchLower)) ||
      (part.color && part.color.color_name.toLowerCase().includes(searchLower))
  );
};

// filter parts by color
const filterPartsByColor = (parts, color) => {
  if (!color) return parts;
  return parts.filter(
    (part) => part.color && part.color._id.toString() === color
  );
};

// filter parts by category
const filterPartsByCategory = (parts, category) => {
  if (!category) return parts;
  return parts.filter(
    (part) => part.category_name && part.category_name === category
  );
};

// ==================== PAGINATION HELPERS ====================

// paginate parts
const paginateParts = (parts, page, limit) => {
  const totalParts = parts.length;
  const pageNum = parseInt(page, 10) || 1;

  if (limit === undefined || limit === "all") {
    return {
      paginatedParts: parts,
      totalParts,
      totalPages: 1,
      page: pageNum,
    };
  }

  const limitNum = parseInt(limit, 10) || 10;
  const totalPages = Math.ceil(totalParts / limitNum);
  const startIdx = (pageNum - 1) * limitNum;
  const paginatedParts = parts.slice(startIdx, startIdx + limitNum);

  return {
    paginatedParts,
    totalParts,
    totalPages,
    page: pageNum,
  };
};

// ==================== FILTER OPTIONS HELPERS ====================

// get available categories
const getAvailableCategories = (allParts, colorFilter) => {
  let filteredParts = allParts;

  if (colorFilter) {
    filteredParts = allParts.filter(
      (part) => part.color && part.color._id.toString() === colorFilter
    );
  }

  return Array.from(
    new Set(filteredParts.map((p) => p.category_name).filter(Boolean))
  );
};

// get available colors
const getAvailableColors = (allParts, categoryFilter) => {
  let filteredParts = allParts;

  if (categoryFilter) {
    filteredParts = allParts.filter(
      (part) => part.category_name && part.category_name === categoryFilter
    );
  }

  return filteredParts
    .map((p) => p.color)
    .filter(Boolean)
    .map((c) => ({
      id: c._id,
      name: c.color_name,
      hex: c.hex_code,
    }))
    .filter((c, index, arr) => arr.findIndex((cc) => cc.id === c.id) === index);
};

// ==================== ERROR HANDLING HELPERS ====================

// handle controller errors
const handleControllerError = (error, next) => {
  if (error instanceof customErrorHandler) {
    return next(error);
  }
  return next(new customErrorHandler(error.message, 500));
};

// ==================== CONTROLLER FUNCTIONS ====================

// ==================== GET ALL LOTTERIES ========================
export const getAllLotteries = catchAsyncErrors(async (req, res, next) => {
  const { sortBy } = req.query;

  let lotteries = await Lottery.find()
    .populate("collection", "name")
    .populate({
      path: "parts.part",
      populate: { path: "color", select: "color_name hex_code" },
    })
    .lean();

  // Apply sorting
  lotteries = sortLotteries(lotteries, sortBy);

  // Format lottery data for frontend
  const formattedLotteries = lotteries.map((lottery) => {
    const flatParts = (lottery.parts || []).map((p) => ({
      ...p.part,
      quantity: p.quantity,
      total_value: p.total_value,
      price: p.price,
    }));
    return {
      ...formatLotteryForFrontend(lottery),
      parts: flatParts,
    };
  });

  res.status(200).json({
    success: true,
    message: `${formattedLotteries.length} lotteries retrieved`,
    lotteries: formattedLotteries,
  });
});

// ==================== GET LOTTERY BY ID WITH PARTS ========================
export const getLotteryById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const lottery = await populateLotteryWithParts(Lottery.findById(id)).lean();

  if (!lottery) {
    return next(new customErrorHandler("Lottery not found", 404));
  }

  // Format lottery data
  const formattedLottery = formatLotteryForFrontend(lottery);

  res.status(200).json({
    success: true,
    message: "Lottery retrieved successfully",
    lottery: formattedLottery,
  });
});

// ==================== CREATE LOTTERY ========================
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
    handleControllerError(error, next);
  }
});

// ==================== UPDATE LOTTERY ========================
export const updateLottery = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const lottery = await Lottery.findById(id);
    if (!lottery) {
      return next(new customErrorHandler("Lottery not found", 404));
    }

    // Validate whyCollect if provided
    validateWhyCollect(updateData.whyCollect);

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
    handleControllerError(error, next);
  }
});

// ==================== DELETE LOTTERY ========================
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

// ==================== GET LOTTERY PARTS WITH QUERY ========================
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

    // Apply filters
    parts = filterPartsBySearch(parts, search);
    parts = filterPartsByColor(parts, color);
    parts = filterPartsByCategory(parts, category);

    // Apply sorting
    parts = sortParts(parts, sort);

    // Apply pagination
    const {
      paginatedParts,
      totalParts,
      totalPages,
      page: pageNum,
    } = paginateParts(parts, page, limit);

    // Calculate available filter options
    const allParts = (lottery.parts || []).map((p) => p.part);
    const availableCategories = getAvailableCategories(allParts, color);
    const availableColors = getAvailableColors(allParts, category);

    res.status(200).json({
      success: true,
      count: paginatedParts.length,
      totalParts,
      totalPages,
      page: pageNum,
      parts: paginatedParts,
      availableCategories,
      availableColors,
    });
  }
);
