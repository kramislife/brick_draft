// MongoDB Aggregation Helpers for Lottery and Parts Queries
// All sorting, filtering, and pagination now handled server-side via MongoDB

// ==================== MONGODB AGGREGATION HELPERS ====================

// Build MongoDB sort object for lottery queries
export const buildLotterySortObject = (sortBy) => {
  const sortObj = {};

  switch (sortBy) {
    case "created_at":
      sortObj.createdAt = -1;
      break;
    case "-created_at":
      sortObj.createdAt = 1;
      break;
    case "title":
      sortObj.title = 1;
      break;
    case "-title":
      sortObj.title = -1;
      break;
    case "draw_date":
      sortObj.drawDate = 1;
      break;
    case "-draw_date":
      sortObj.drawDate = -1;
      break;
    case "price":
      sortObj.ticketPrice = 1;
      break;
    case "-price":
      sortObj.ticketPrice = -1;
      break;
    case "pieces":
      sortObj.pieces = 1;
      break;
    case "-pieces":
      sortObj.pieces = -1;
      break;
    case "featured":
      sortObj.tag = 1;
      sortObj.createdAt = -1;
      break;
    case "best_seller":
      sortObj.tag = 1;
      sortObj.createdAt = -1;
      break;
    case "new_arrival":
      sortObj.tag = 1;
      sortObj.createdAt = -1;
      break;
    case "limited_edition":
      sortObj.tag = 1;
      sortObj.createdAt = -1;
      break;
    default:
      sortObj.createdAt = -1;
  }

  return sortObj;
};

// Build MongoDB sort object for parts queries
export const buildPartsSortObject = (sort) => {
  const sortObj = {};

  switch (sort) {
    case "name":
      sortObj.name = 1;
      break;
    case "-name":
      sortObj.name = -1;
      break;
    case "item_id":
      sortObj.item_id = 1;
      break;
    case "-item_id":
      sortObj.item_id = -1;
      break;
    case "part_id":
      sortObj.part_id = 1;
      break;
    case "-part_id":
      sortObj.part_id = -1;
      break;
    case "category":
      sortObj.category_name = 1;
      break;
    case "-category":
      sortObj.category_name = -1;
      break;
    case "price":
      sortObj.lotteryPrice = 1;
      break;
    case "-price":
      sortObj.lotteryPrice = -1;
      break;
    case "quantity":
      sortObj.lotteryQuantity = 1;
      break;
    case "-quantity":
      sortObj.lotteryQuantity = -1;
      break;
    case "total_value":
      sortObj.lotteryTotalValue = 1;
      break;
    case "-total_value":
      sortObj.lotteryTotalValue = -1;
      break;
    case "date":
      sortObj.createdAt = 1;
      break;
    case "-date":
      sortObj.createdAt = -1;
      break;
    default:
      sortObj.name = 1;
  }

  return sortObj;
};

// Build MongoDB match stage for parts search
export const buildPartsMatchStage = (partIds, search, color, category) => {
  const matchStage = { _id: { $in: partIds } };

  // Add search filter
  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { item_id: { $regex: search, $options: "i" } },
      { part_id: { $regex: search, $options: "i" } },
    ];
  }

  // Add category filter (category_name with category fallback)
  if (category) {
    const categoryFilter = {
      $or: [
        { category_name: { $regex: category, $options: "i" } },
        { category: { $regex: category, $options: "i" } },
      ],
    };

    if (matchStage.$or) {
      // If search filter exists, combine with AND logic
      matchStage.$and = [{ $or: matchStage.$or }, categoryFilter];
      delete matchStage.$or;
    } else {
      // If no search filter, use category filter directly
      Object.assign(matchStage, categoryFilter);
    }
  }

  // Note: Color filtering will be handled after the $lookup stage
  // We'll add it to the pipeline after the color lookup

  return matchStage;
};

// Build MongoDB aggregation pipeline for lottery parts
export const buildLotteryPartsPipeline = (lottery, options = {}) => {
  const {
    search,
    sort = "name",
    page = 1,
    limit = 20,
    color,
    category,
  } = options;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Extract part IDs from lottery
  const partIds = lottery.parts.map((p) => p.part);

  if (partIds.length === 0) {
    return null; // No parts to process
  }

  // Build match stage
  const matchStage = buildPartsMatchStage(partIds, search, color, category);

  // Build sort object
  const sortObj = buildPartsSortObject(sort);

  // Build aggregation pipeline
  const aggregationPipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "colors",
        localField: "color",
        foreignField: "_id",
        as: "color",
      },
    },
    { $unwind: { path: "$color", preserveNullAndEmptyArrays: true } },
    // Add color filter after lookup
    ...(color ? [{ $match: { "color._id": color } }] : []),
    {
      $addFields: {
        // Add lottery-specific fields from the parts array
        lotteryQuantity: {
          $let: {
            vars: {
              partRef: { $toString: "$_id" },
            },
            in: {
              $reduce: {
                input: lottery.parts,
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: [{ $toString: "$$this.part" }, "$$partRef"] },
                    "$$this.quantity",
                    "$$value",
                  ],
                },
              },
            },
          },
        },
        lotteryPrice: {
          $let: {
            vars: {
              partRef: { $toString: "$_id" },
            },
            in: {
              $reduce: {
                input: lottery.parts,
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: [{ $toString: "$$this.part" }, "$$partRef"] },
                    "$$this.price",
                    "$$value",
                  ],
                },
              },
            },
          },
        },
        lotteryTotalValue: {
          $let: {
            vars: {
              partRef: { $toString: "$_id" },
            },
            in: {
              $reduce: {
                input: lottery.parts,
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: [{ $toString: "$$this.part" }, "$$partRef"] },
                    "$$this.total_value",
                    "$$value",
                  ],
                },
              },
            },
          },
        },
      },
    },
    { $sort: sortObj },
    {
      $facet: {
        parts: [
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              _id: 1,
              name: 1,
              part_id: 1,
              item_id: 1,
              category_name: 1,
              weight: 1,
              item_image: 1,
              color: { color_name: 1, hex_code: 1 },
              quantity: "$lotteryQuantity",
              price: "$lotteryPrice",
              total_value: "$lotteryTotalValue",
            },
          },
        ],
        totalCount: [{ $count: "count" }],
        availableCategories: [
          { $group: { _id: "$category_name" } },
          { $sort: { _id: 1 } },
        ],
        availableColors: [
          {
            $group: {
              _id: "$color.color_name",
              hex_code: { $first: "$color.hex_code" },
            },
          },
          { $match: { _id: { $ne: null } } },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ];

  return aggregationPipeline;
};

// Process lottery parts aggregation results
export const processLotteryPartsResults = (result, page, limit) => {
  if (!result) {
    return {
      parts: [],
      totalParts: 0,
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPrevPage: false,
      startEntry: 0,
      endEntry: 0,
      availableCategories: [],
      availableColors: [],
    };
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const parts = result.parts || [];
  const totalParts = result.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalParts / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;
  const startEntry = skip + 1;
  const endEntry = Math.min(skip + limitNum, totalParts);

  const availableCategories = result.availableCategories
    .map((c) => c._id)
    .filter(Boolean);
  const availableColors = result.availableColors
    .map((c) => ({
      id: c._id,
      name: c._id,
      hex: c.hex_code || "#000000",
    }))
    .filter((c) => c.id);

  return {
    parts,
    totalParts,
    totalPages,
    page: pageNum,
    hasNextPage,
    hasPrevPage,
    startEntry,
    endEntry,
    availableCategories,
    availableColors,
  };
};
