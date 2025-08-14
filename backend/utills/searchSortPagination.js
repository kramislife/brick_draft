// Default pagination settings
const DEFAULT_PAGE_SIZE = 20;

// ==================== SORTING FUNCTIONS ====================

// Sort parts based on specified criteria
export const sortParts = (parts, sort) => {
  if (!sort || !Array.isArray(parts)) return parts;

  const sortFunctions = {
    // Name sorting
    name: (a, b) => (a.name || "").localeCompare(b.name || ""),
    "-name": (a, b) => (b.name || "").localeCompare(a.name || ""),

    // Quantity sorting
    quantity: (a, b) => (a.quantity || 0) - (b.quantity || 0),
    "-quantity": (a, b) => (b.quantity || 0) - (a.quantity || 0),

    // Total value sorting
    total_value: (a, b) => (a.total_value || 0) - (b.total_value || 0),
    "-total_value": (a, b) => (b.total_value || 0) - (a.total_value || 0),

    // Price sorting
    price: (a, b) => (a.price || 0) - (b.price || 0),
    "-price": (a, b) => (b.price || 0) - (a.price || 0),

    // Date sorting
    date: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    "-date": (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),

    // Category sorting
    category: (a, b) =>
      (a.category_name || "").localeCompare(b.category_name || ""),
    "-category": (a, b) =>
      (b.category_name || "").localeCompare(a.category_name || ""),
  };

  const sortFunction = sortFunctions[sort];
  return sortFunction ? [...parts].sort(sortFunction) : parts;
};

// Sort lotteries based on specified criteria
export const sortLotteries = (lotteries, sortBy) => {
  if (!sortBy || !Array.isArray(lotteries)) {
    return lotteries.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  const sortFunctions = {
    // featured sorting
    featured: (a, b) =>
      (b.tag?.includes("featured") || false) -
      (a.tag?.includes("featured") || false),

    // best seller sorting
    best_seller: (a, b) =>
      (b.tag?.includes("best_seller") || false) -
      (a.tag?.includes("best_seller") || false),

    // new arrival sorting
    new_arrival: (a, b) =>
      (b.tag?.includes("new_arrival") || false) -
      (a.tag?.includes("new_arrival") || false),

    // limited edition sorting
    limited_edition: (a, b) =>
      (b.tag?.includes("limited_edition") || false) -
      (a.tag?.includes("limited_edition") || false),

    // draw date sorting
    draw_date: (a, b) => new Date(a.drawDate || 0) - new Date(b.drawDate || 0),
    "-draw_date": (a, b) =>
      new Date(b.drawDate || 0) - new Date(a.drawDate || 0),

    // created at sorting
    created_at: (a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    "-created_at": (a, b) =>
      new Date(a.createdAt || 0) - new Date(b.createdAt || 0),

    // price sorting
    price: (a, b) => (a.ticketPrice || 0) - (b.ticketPrice || 0),
    "-price": (a, b) => (b.ticketPrice || 0) - (a.ticketPrice || 0),

    // pieces sorting
    pieces: (a, b) => (a.pieces || 0) - (b.pieces || 0),
    "-pieces": (a, b) => (b.pieces || 0) - (a.pieces || 0),
  };

  const sortFunction = sortFunctions[sortBy];
  return sortFunction
    ? [...lotteries].sort(sortFunction)
    : lotteries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// ==================== FILTER BY CATEGORIES AND COLORS ====================

// Filter parts by color
export const filterPartsByColor = (parts, color) => {
  if (!color || color === "all" || !Array.isArray(parts)) return parts;
  return parts.filter(
    (part) => part.color && part.color._id.toString() === color.toString()
  );
};

// Filter parts by category
export const filterPartsByCategory = (parts, category) => {
  if (!category || category === "all" || !Array.isArray(parts)) return parts;
  return parts.filter(
    (part) => part.category_name && part.category_name === category
  );
};

// ==================== SEARCH FUNCTIONS ====================

// Filter parts by search term
export const filterPartsBySearch = (parts, search) => {
  if (!search || !Array.isArray(parts)) return parts;

  const searchLower = search.toLowerCase().trim();
  if (searchLower.length === 0) return parts;

  return parts.filter((part) => {
    // Search in name
    if (part.name?.toLowerCase().includes(searchLower)) return true;

    // Search in part_id
    if (part.part_id?.toLowerCase().includes(searchLower)) return true;

    // Search in item_id
    if (part.item_id?.toLowerCase().includes(searchLower)) return true;

    // Search in category_name
    if (part.category_name?.toLowerCase().includes(searchLower)) return true;

    // Search in color name
    if (part.color?.color_name?.toLowerCase().includes(searchLower))
      return true;

    // Search in description (if available)
    if (part.description?.toLowerCase().includes(searchLower)) return true;

    return false;
  });
};

// ==================== PAGINATION FUNCTIONS ====================

// Paginate data with optimized performance
export const paginateData = (data, page = 1, limit = DEFAULT_PAGE_SIZE) => {
  if (!Array.isArray(data)) {
    return {
      paginatedData: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }

  const totalItems = data.length;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  // Handle "select all" option in priority list dialog
  if (limit === "all" || limit === undefined) {
    return {
      paginatedData: data,
      totalItems,
      totalPages: 1,
      currentPage,
      hasNextPage: false,
      hasPrevPage: false,
      startEntry: totalItems === 0 ? 0 : 1,
      endEntry: totalItems,
    };
  }

  // Validate and set limit
  let itemsPerPage = parseInt(limit, 10) || DEFAULT_PAGE_SIZE;
  itemsPerPage = Math.max(1, itemsPerPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Use slice for better performance with large datasets
  const paginatedData = data.slice(startIndex, endIndex);

  // Calculate start and end entry numbers for display
  const startEntry = totalItems === 0 ? 0 : startIndex + 1;
  const endEntry = Math.min(endIndex, totalItems);

  return {
    paginatedData,
    totalItems,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    itemsPerPage,
    startEntry,
    endEntry,
  };
};

// Optimized pagination for large datasets with cursor-based approach
export const paginateWithCursor = (
  data,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  cursorField = "_id",
  cursor = null
) => {
  if (!Array.isArray(data)) {
    return {
      paginatedData: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
      nextCursor: null,
      prevCursor: null,
    };
  }

  const totalItems = data.length;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const itemsPerPage = Math.max(1, parseInt(limit, 10) || DEFAULT_PAGE_SIZE);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = data.slice(startIndex, endIndex);

  // Calculate start and end entry numbers for display
  const startEntry = totalItems === 0 ? 0 : startIndex + 1;
  const endEntry = Math.min(endIndex, totalItems);

  // Calculate cursors for next/prev pages
  const nextCursor =
    endIndex < totalItems
      ? paginatedData[paginatedData.length - 1]?.[cursorField]
      : null;
  const prevCursor = startIndex > 0 ? paginatedData[0]?.[cursorField] : null;

  return {
    paginatedData,
    totalItems,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    itemsPerPage,
    startEntry,
    endEntry,
    nextCursor,
    prevCursor,
  };
};

// ==================== FILTER OPTIONS HELPERS ====================

// Get available categories from parts data
export const getAvailableCategories = (allParts, colorFilter) => {
  if (!Array.isArray(allParts)) return [];

  let filteredParts = allParts;

  if (colorFilter && colorFilter !== "all") {
    filteredParts = allParts.filter(
      (part) =>
        part.color && part.color._id.toString() === colorFilter.toString()
    );
  }

  return Array.from(
    new Set(filteredParts.map((p) => p.category_name).filter(Boolean))
  ).sort();
};

// Get available colors from parts data
export const getAvailableColors = (allParts, categoryFilter) => {
  if (!Array.isArray(allParts)) return [];

  let filteredParts = allParts;

  if (categoryFilter && categoryFilter !== "all") {
    filteredParts = allParts.filter(
      (part) => part.category_name && part.category_name === categoryFilter
    );
  }

  // Use a Map to ensure unique colors by ID
  const colorMap = new Map();

  filteredParts
    .map((p) => p.color)
    .filter(Boolean)
    .forEach((c) => {
      // Ensure we have valid color data
      if (c._id && c.color_name) {
        const colorId = c._id.toString();
        if (!colorMap.has(colorId)) {
          colorMap.set(colorId, {
            id: c._id,
            name: c.color_name,
            hex: c.hex_code || "#000000", // Default fallback
          });
        }
      }
    });

  return Array.from(colorMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

// ==================== COMPOSITE FUNCTIONS ====================

// Apply all filters, sorting, and pagination in one optimized operation
export const processDataWithFilters = (data, options = {}) => {
  const {
    search,
    sort,
    color,
    category,
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    cursorField,
    cursor,
  } = options;

  if (!Array.isArray(data)) {
    return {
      processedData: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
      availableCategories: [],
      availableColors: [],
    };
  }

  let processedData = [...data];

  // Apply filters in order of selectivity (most selective first)
  if (color && color !== "all") {
    processedData = filterPartsByColor(processedData, color);
  }

  if (category && category !== "all") {
    processedData = filterPartsByCategory(processedData, category);
  }

  if (search) {
    processedData = filterPartsBySearch(processedData, search);
  }

  // Get available filter options before sorting
  const availableCategories = getAvailableCategories(data, color);
  const availableColors = getAvailableColors(data, category);

  // Apply sorting
  if (sort) {
    processedData = sortParts(processedData, sort);
  }

  // Apply pagination
  const paginationResult =
    cursorField && cursor
      ? paginateWithCursor(processedData, page, limit, cursorField, cursor)
      : paginateData(processedData, page, limit);

  return {
    ...paginationResult,
    processedData: paginationResult.paginatedData,
    availableCategories,
    availableColors,
  };
};

// Process lottery data with all filters and formatting
export const processLotteriesWithFilters = (lotteries, options = {}) => {
  const { sortBy, page = 1, limit = DEFAULT_PAGE_SIZE } = options;

  if (!Array.isArray(lotteries)) {
    return {
      processedLotteries: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }

  let processedLotteries = [...lotteries];

  // Apply sorting
  if (sortBy) {
    processedLotteries = sortLotteries(processedLotteries, sortBy);
  }

  // Apply pagination
  const paginationResult = paginateData(processedLotteries, page, limit);

  return {
    ...paginationResult,
    processedLotteries: paginationResult.paginatedData,
  };
};

// ==================== PERFORMANCE OPTIMIZATION HELPERS ====================

// Create an index map for faster lookups
export const createIndexMap = (data, keyField = "_id") => {
  if (!Array.isArray(data)) return new Map();

  const indexMap = new Map();
  data.forEach((item, index) => {
    const key = item[keyField];
    if (key !== undefined) {
      indexMap.set(key.toString(), index);
    }
  });

  return indexMap;
};

// Batch process data for better memory management
export const batchProcess = (data, processor, batchSize = 1000) => {
  if (!Array.isArray(data) || typeof processor !== "function") return [];

  const results = [];
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const processedBatch = batch.map(processor);
    results.push(...processedBatch);
  }

  return results;
};

// ==================== VALIDATION HELPERS ====================

// Validate pagination parameters
export const validatePaginationParams = (page, limit) => {
  const validatedPage = Math.max(1, parseInt(page, 10) || 1);
  let validatedLimit = parseInt(limit, 10) || DEFAULT_PAGE_SIZE;

  if (limit === "all") {
    validatedLimit = "all";
  } else {
    validatedLimit = Math.max(1, validatedLimit);
  }

  return { page: validatedPage, limit: validatedLimit };
};

// Validate sort parameter
export const validateSortParam = (sort, allowedSorts = []) => {
  if (!sort || !Array.isArray(allowedSorts) || allowedSorts.length === 0) {
    return null;
  }

  return allowedSorts.includes(sort) ? sort : null;
};
