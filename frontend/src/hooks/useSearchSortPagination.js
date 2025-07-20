import { useState, useCallback, useMemo } from "react";
import { PER_PAGE_OPTIONS } from "@/constant/sortOption";

export const useSearchSortPagination = (initialOptions = {}) => {
  const {
    initialSearch = "",
    initialSort = "name",
    initialCategory = "all",
    initialColor = "all",
    initialPage = 1,
    initialPerPage = 20,
    sortOptions = [],
    perPageOptions = PER_PAGE_OPTIONS,
  } = initialOptions;

  // State management
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [category, setCategory] = useState(initialCategory);
  const [color, setColor] = useState(initialColor);
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  // Reset pagination when filters change
  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

  // Handlers with pagination reset
  const handleSearchChange = useCallback(
    (e) => {
      setSearch(e.target.value);
      resetPagination();
    },
    [resetPagination]
  );

  const handleSortChange = useCallback(
    (value) => {
      setSort(value);
      resetPagination();
    },
    [resetPagination]
  );

  const handleCategoryChange = useCallback(
    (value) => {
      setCategory(value);
      resetPagination();
    },
    [resetPagination]
  );

  const handleColorChange = useCallback(
    (value) => {
      setColor(value);
      resetPagination();
    },
    [resetPagination]
  );

  const handlePerPageChange = useCallback(
    (value) => {
      setPerPage(Number(value));
      resetPagination();
    },
    [resetPagination]
  );

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Generate pagination numbers
  const getPageNumbers = useCallback((totalPages, currentPage) => {
    if (totalPages <= 1) {
      return [];
    }
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);
    if (currentPage > 4) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 3) pages.push("...");
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
  }, []);

  // Calculate pagination display values
  const calculatePaginationDisplay = useCallback(
    (totalItems, currentPage, itemsPerPage) => {
      if (totalItems === 0) {
        return { startEntry: 0, endEntry: 0 };
      }

      const startEntry = (currentPage - 1) * itemsPerPage + 1;
      const endEntry = Math.min(startEntry + itemsPerPage - 1, totalItems);

      return { startEntry, endEntry };
    },
    []
  );

  // Reset all filters and pagination
  const resetAll = useCallback(() => {
    setSearch(initialSearch);
    setSort(initialSort);
    setCategory(initialCategory);
    setColor(initialColor);
    setPage(initialPage);
    setPerPage(initialPerPage);
  }, [
    initialSearch,
    initialSort,
    initialCategory,
    initialColor,
    initialPage,
    initialPerPage,
  ]);

  // Memoized values
  const paginationParams = useMemo(() => {
    const params = {
      search,
      sort,
      color: color === "all" ? undefined : color,
      category: category === "all" ? undefined : category,
      page,
      limit: perPage,
    };
    return params;
  }, [search, sort, color, category, page, perPage]);

  const filterState = useMemo(
    () => ({
      search,
      sort,
      category,
      color,
      page,
      perPage,
    }),
    [search, sort, category, color, page, perPage]
  );

  return {
    // State
    search,
    sort,
    category,
    color,
    page,
    perPage,
    filterState,
    paginationParams,

    // Handlers
    handleSearchChange,
    handleSortChange,
    handleCategoryChange,
    handleColorChange,
    handlePerPageChange,
    handlePageChange,
    resetPagination,
    resetAll,

    // Pagination
    getPageNumbers,
    calculatePaginationDisplay,

    // Options
    sortOptions,
    perPageOptions,
  };
};
