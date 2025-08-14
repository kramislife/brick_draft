import React from "react";
import { Package } from "lucide-react";
import PartItemCard from "@/components/home/components/PartItemCard";
import SearchSortPaginationWrapper from "@/components/shared/SearchSortPaginationWrapper";

const LotteryPartsSection = ({
  // Data props
  paginatedParts,
  totalParts,
  startEntry,
  endEntry,
  totalPages,
  currentPage,
  categoryOptions,
  colorOptions,

  // Display props
  partsTitle,
  isLoading = false,
  drawDate,

  // Callback for when params change
  onParamsChange,
}) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-5">{partsTitle}</h2>

      <SearchSortPaginationWrapper
        categoryOptions={categoryOptions}
        colorOptions={colorOptions}
        totalItems={totalParts}
        currentPage={currentPage}
        totalPages={totalPages}
        startEntry={startEntry}
        endEntry={endEntry}
        showPerPage={true}
        showPagination={totalPages > 1}
        compact={false}
        onParamsChange={onParamsChange}
      >
        {/* Parts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-24 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : paginatedParts && paginatedParts.length > 0 ? (
          <div className="grid grid-cols-1 gap-1">
            {paginatedParts.map((part, index) => (
              <PartItemCard
                key={`${part._id}-${index}`}
                part={part}
                drawDate={drawDate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No parts available for this lottery yet.</p>
          </div>
        )}
      </SearchSortPaginationWrapper>
    </div>
  );
};

export default LotteryPartsSection;
