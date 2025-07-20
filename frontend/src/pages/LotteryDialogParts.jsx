import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import PartItemCard from "@/components/home/components/PartItemCard";
import { useGetLotteryPartsByIdQuery } from "@/redux/api/lotteryApi";

const LotteryDialogParts = ({ setName, drawDate, lotteryId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allParts, setAllParts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef();

  // Fetch parts with pagination
  const {
    data: partsData,
    isLoading,
    error,
    refetch,
  } = useGetLotteryPartsByIdQuery(
    {
      id: lotteryId,
      params: {
        page: currentPage,
        limit: 20,
        sort: "name",
      },
    },
    {
      skip: !lotteryId,
    }
  );

  // Update parts when data changes
  useEffect(() => {
    if (partsData?.parts) {
      if (currentPage === 1) {
        setAllParts(partsData.parts);
      } else {
        setAllParts((prev) => [...prev, ...partsData.parts]);
      }

      // Check if there are more pages to load
      const hasMorePages = partsData.page < partsData.totalPages;
      setHasMore(hasMorePages);
      setIsLoadingMore(false);
    }
  }, [partsData, currentPage]);

  // Infinite scroll observer
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setIsLoadingMore(true);
            setCurrentPage((prev) => prev + 1);
          }
        },
        { threshold: 0.1, rootMargin: "100px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isLoadingMore, hasMore]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Reset state when dialog opens or lotteryId changes
  useEffect(() => {
    if (lotteryId) {
      setCurrentPage(1);
      setAllParts([]);
      setHasMore(true);
      setIsLoadingMore(false);
      // Force refetch to get fresh data
      setTimeout(() => refetch(), 100);
    }
  }, [lotteryId, refetch]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-1">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 p-3 border rounded-lg bg-card"
        >
          <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      ))}
    </div>
  );

  // If no lotteryId, show a message
  if (!lotteryId) {
    return (
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-start text-2xl font-bold">
            {setName} Parts
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-8 text-muted-foreground">
          <p>No parts information available for this lottery set.</p>
        </div>
      </DialogContent>
    );
  }

  // Error state
  if (error) {
    return (
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-start text-2xl font-bold">
            {setName} Parts
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-red-500 mb-2">Failed to load parts</p>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-start text-xl font-bold">
          {setName} Parts
        </DialogTitle>
        <DialogDescription className="sr-only">
          This is a list of all the parts that are included in the lottery set.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {/* Initial loading */}
        {isLoading && currentPage === 1 && <LoadingSkeleton />}

        {/* Parts list */}
        {allParts.length > 0 && (
          <div className="space-y-1">
            {allParts.map((part, index) => (
              <PartItemCard
                key={`${part._id}-${index}`}
                part={part}
                drawDate={drawDate}
              />
            ))}
          </div>
        )}

        {/* Loading more skeleton */}
        {isLoadingMore && (
          <div className="space-y-3">
            <div className="text-center py-2 text-muted-foreground text-sm">
              <p>Loading more parts...</p>
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {/* No more data indicator */}
        {!hasMore && allParts.length > 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <p>All parts loaded ({allParts.length} total)</p>
          </div>
        )}

        {/* Invisible trigger for infinite scroll */}
        {hasMore && <div ref={lastElementRef} className="h-1" />}

        {/* No parts found */}
        {!isLoading && !isLoadingMore && allParts.length === 0 && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No parts available for this lottery set.</p>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default LotteryDialogParts;
