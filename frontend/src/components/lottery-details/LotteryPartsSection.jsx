import React from "react";
import { Package } from "lucide-react";
import PartItemCard from "@/components/home/components/PartItemCard";
import SearchSortPaginationWrapper from "@/components/shared/SearchSortPaginationWrapper";
import PartItemCardSkeletonList from "@/components/layout/fallback/PartItemCardSkeleton";
import { useLotteryPartsSection } from "@/hooks/useLottery";

const LotteryPartsSection = ({ lotteryId, partsTitle, drawDate }) => {
  const {
    parts,
    totalParts,
    totalPages,
    currentPage,
    startEntry,
    endEntry,
    categoryOptions,
    colorOptions,
    isLoading,
    shouldShowPaginationWrapper,
    onParamsChange,
  } = useLotteryPartsSection({ lotteryId, partsTitle });

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-5">{partsTitle}</h2>

      {shouldShowPaginationWrapper ? (
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
            <PartItemCardSkeletonList count={5} />
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {parts.map((part, index) => (
                <PartItemCard
                  key={`${part._id}-${index}`}
                  part={part}
                  drawDate={drawDate}
                />
              ))}
            </div>
          )}
        </SearchSortPaginationWrapper>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No parts available for this lottery yet.</p>
        </div>
      )}
    </div>
  );
};

export default LotteryPartsSection;
