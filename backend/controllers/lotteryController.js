import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import { uploadImage, deleteImage } from "../utills/cloudinary.js";
import Lottery from "../models/lottery.model.js";
import Part from "../models/part.model.js";
import Color from "../models/color.model.js";
import {
  buildLotterySortObject,
  buildLotteryPartsPipeline,
  processLotteryPartsResults,
} from "../utills/searchSortPagination.js";

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
  // Accept colorName as string or object
  if (typeof colorName === "object" && colorName !== null) {
    colorName = colorName.color_name || colorName.name || "";
  }
  if (typeof colorName !== "string" || colorName.trim() === "") {
    return null;
  }
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
        part_id: csvPart.part_id ? csvPart.part_id.trim() : undefined,
        item_id: csvPart.item_id.trim(),
        category: csvPart.category ? csvPart.category.toLowerCase() : "part",
        category_name: csvPart.category_name
          ? csvPart.category_name.trim()
          : "Part",
        weight: cleanWeight,
        color: colorDoc ? colorDoc._id : undefined,
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

// ==================== FORMATTING HELPERS ====================

// Check if ticket sales are closed (30 minutes before draw)
const isTicketSalesClosed = (drawDate, drawTime) => {
  if (!drawDate || !drawTime) return false;

  try {
    // Combine drawDate and drawTime into a Date object
    const [hours, minutes] = drawTime.split(":").map((n) => parseInt(n, 10));
    const drawDateTime = new Date(drawDate);
    drawDateTime.setHours(hours, minutes, 0, 0);

    // Cutoff time = 30 minutes before draw
    const cutoffTime = new Date(drawDateTime.getTime() - 30 * 60 * 1000);

    // Current server time
    const now = new Date();

    return now >= cutoffTime; // true if sales are closed
  } catch (err) {
    console.error("Error in isTicketSalesClosed:", err.message);
    return false;
  }
};

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

// create URL-friendly set name
const createUrlFriendlySetName = (title) => {
  return title
    .replace(/[^a-zA-Z0-9\s-&]/g, "") // Remove special characters except spaces, hyphens, &
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .toLowerCase()
    .trim();
};

// format lottery data for frontend
const formatLotteryForFrontend = (lottery) => ({
  ...lottery,
  formattedDrawDate: formatDrawDate(lottery.drawDate),
  formattedDrawTime: formatDrawTime(lottery.drawTime),
  formattedTag: formatTagForDisplay(lottery.tag),
  urlFriendlySetName: createUrlFriendlySetName(lottery.title),
});

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
  const { sortBy = "created_at", page = 1, limit = 20, status } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const sortObj = buildLotterySortObject(sortBy);

  // Build query - if status is specified, filter by it, otherwise return all statuses
  const query = status ? { lottery_status: status } : {};

  // Get total count for pagination
  const totalItems = await Lottery.countDocuments(query);

  // Fetch lotteries with minimal projection and server-side pagination
  const lotteries = await Lottery.find(query)
    .select(
      "title description whyCollect image collection ticketPrice marketPrice pieces drawDate drawTime totalSlots slotsAvailable tag lottery_status createdAt"
    )
    .populate("collection", "name")
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Format lottery data for frontend
  const formattedLotteries = lotteries.map((lottery) => ({
    ...formatLotteryForFrontend(lottery),
    isTicketSalesClosed: isTicketSalesClosed(
      lottery.drawDate,
      lottery.drawTime
    ),
  }));

  // Calculate pagination info
  const totalPages = Math.ceil(totalItems / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  res.status(200).json({
    success: true,
    message: `${totalItems} lotteries retrieved`,
    lotteries: formattedLotteries,
    pagination: {
      totalItems,
      totalPages,
      currentPage: pageNum,
      hasNextPage,
      hasPrevPage,
      startEntry: skip + 1,
      endEntry: Math.min(skip + limitNum, totalItems),
    },
  });
});

// ==================== GET LOTTERY BY ID ========================
export const getLotteryById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Get basic lottery data (without parts)
  const lottery = await Lottery.findById(id)
    .select(
      "title description whyCollect image collection ticketPrice marketPrice pieces drawDate drawTime totalSlots slotsAvailable tag lottery_status createdAt"
    )
    .populate("collection", "name")
    .lean();

  if (!lottery) {
    return next(
      new customErrorHandler("Lottery controller: Lottery not found", 404)
    );
  }

  // Format lottery data
  const formattedLottery = formatLotteryForFrontend(lottery);

  res.status(200).json({
    success: true,
    message: "Lottery retrieved successfully",
    lottery: {
      ...formattedLottery,
      isTicketSalesClosed: isTicketSalesClosed(
        lottery.drawDate,
        lottery.drawTime
      ),
    },
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
      slotsAvailable: totalSlots, // Automatically set to totalSlots
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

    // Remove slotsAvailable from updateData to prevent manual updates
    const { slotsAvailable, ...updateDataWithoutSlots } = updateData;

    // Update lottery (slotsAvailable can only be updated by payment system)
    const updatedLottery = await Lottery.findByIdAndUpdate(
      id,
      {
        ...updateDataWithoutSlots,
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
    const {
      search,
      sort = "name",
      page = 1,
      limit = 20,
      color,
      category,
    } = req.query;

    // First, get the lottery to extract part IDs
    const lottery = await Lottery.findById(id).select("parts").lean();

    if (!lottery) {
      return next(new customErrorHandler("Lottery not found", 404));
    }

    // Build aggregation pipeline using utility function
    const aggregationPipeline = buildLotteryPartsPipeline(lottery, {
      search,
      sort,
      page,
      limit,
      color,
      category,
    });

    if (!aggregationPipeline) {
      // No parts to process
      return res.status(200).json({
        success: true,
        count: 0,
        totalParts: 0,
        totalPages: 0,
        page: 1,
        hasNextPage: false,
        hasPrevPage: false,
        startEntry: 0,
        endEntry: 0,
        parts: [],
        availableCategories: [],
        availableColors: [],
      });
    }

    // Execute aggregation
    const [result] = await Part.aggregate(aggregationPipeline);

    // Process results using utility function
    const processedResults = processLotteryPartsResults(result, page, limit);

    res.status(200).json({
      success: true,
      count: processedResults.parts.length,
      ...processedResults,
    });
  }
);

// ==================== SOCKET CONFIG ========================
export const getSocketConfig = (req, res) => {
  res.json({
    socketUrl: `http://localhost:${process.env.PORT || 4000}`,
    port: process.env.PORT || 4000,
  });
};
