import React from "react";
import { Package } from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PartItemCard from "@/components/home/components/PartItemCard";
import PartItemCardSkeletonList from "@/components/layout/fallback/PartItemCardSkeleton";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { useLotteryDialogParts } from "@/hooks/useLottery";

const LotteryDialogParts = ({ setName, drawDate, lotteryId }) => {
  const {
    isLoading,
    error,
    allParts,
    hasMore,
    isLoadingMore,
    lastElementRef,
    hasNoData,
  } = useLotteryDialogParts({ lotteryId, setName, drawDate });

  if (isLoading) {
    return (
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-start text-xl font-bold">
            {setName} Parts
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          <PartItemCardSkeletonList count={5} />
        </div>
      </DialogContent>
    );
  }

  if (error) {
    return (
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-start text-xl font-bold">
            {setName} Parts
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-8 text-muted-foreground">
          <FallbackStates
            icon={Package}
            title="Failed to Load Parts"
            description="Failed to load parts. Please try again later."
            className="min-h-[200px]"
          />
        </div>
      </DialogContent>
    );
  }

  if (hasNoData) {
    return (
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-start text-xl font-bold">
            {setName} Parts
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-5 text-muted-foreground">
          <FallbackStates
            icon={Package}
            title="No Part Information"
            description="No parts information available for this lottery set."
            className="min-h-[100px]"
          />
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent
      className="sm:max-w-xl"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <DialogHeader>
        <DialogTitle className="text-start text-xl font-bold">
          {setName} Parts
        </DialogTitle>
        <DialogDescription className="sr-only">
          This is a list of all the parts that are included in the lottery set.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {/* Parts list */}
        <div className="space-y-1">
          {allParts.map((part, index) => (
            <PartItemCard
              key={`${part._id}-${index}`}
              part={part}
              drawDate={drawDate}
            />
          ))}
        </div>

        {/* Loading more skeleton */}
        {isLoadingMore && (
          <div className="text-center py-2 text-muted-foreground text-sm">
            <p>Loading more parts...</p>
          </div>
        )}

        {/* Invisible trigger for infinite scroll */}
        {hasMore && <div ref={lastElementRef} className="h-1" />}
      </div>
    </DialogContent>
  );
};

export default LotteryDialogParts;
