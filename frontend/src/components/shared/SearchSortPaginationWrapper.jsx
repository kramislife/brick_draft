import React, { useEffect } from "react";
import { useSearchSortPagination } from "@/hooks/useSearchSortPagination";
import SearchSortControls from "./SearchSortControls";
import PaginationControls from "./PaginationControls";
import { PART_SORT_OPTIONS, PER_PAGE_OPTIONS } from "@/constant/sortOption";

const SearchSortPaginationWrapper = ({
  // Hook configuration (optional, will use defaults if not provided)
  initialOptions = {},

  // Filter options from API
  categoryOptions = [],
  colorOptions = [],

  // Data from API
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  startEntry = 0,
  endEntry = 0,

  // Display options
  showPerPage = true,
  showPagination = true,
  compact = false,

  // Loading state
  isLoading = false,

  // Callback for when pagination params change
  onParamsChange,

  // Children to render between controls and pagination
  children,
}) => {
  // Merge default options with provided options
  const mergedOptions = {
    initialSort: "name", // Ensure default sort is applied immediately
    sortOptions: PART_SORT_OPTIONS,
    perPageOptions: PER_PAGE_OPTIONS,
    ...initialOptions,
  };

  // Use the custom hook for all search, sort, and pagination logic
  const {
    search,
    sort,
    category,
    color,
    page,
    perPage,
    paginationParams,
    handleSearchChange,
    handleSortChange,
    handleCategoryChange,
    handleColorChange,
    handlePerPageChange,
    handlePageChange,
    sortOptions,
    perPageOptions,
  } = useSearchSortPagination(mergedOptions);

  // Notify parent component when params change
  useEffect(() => {
    if (onParamsChange) {
      onParamsChange(paginationParams);
    }
  }, [paginationParams, onParamsChange]);

  return (
    <div className="space-y-5">
      {/* Search, Sort, and Filter Controls */}
      <SearchSortControls
        search={search}
        onSearchChange={handleSearchChange}
        sort={sort}
        onSortChange={handleSortChange}
        sortOptions={sortOptions}
        category={category}
        onCategoryChange={handleCategoryChange}
        categoryOptions={categoryOptions}
        color={color}
        onColorChange={handleColorChange}
        colorOptions={colorOptions}
        perPage={perPage}
        onPerPageChange={handlePerPageChange}
        perPageOptions={perPageOptions}
        showPerPage={showPerPage}
        isLoading={isLoading}
        compact={compact}
      />

      {/* Data Section - Rendered by parent component */}
      {children}

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        startEntry={startEntry}
        endEntry={endEntry}
        totalItems={totalItems}
        showPagination={showPagination && totalPages > 1}
      />
    </div>
  );
};

export default SearchSortPaginationWrapper;
