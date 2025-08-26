import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const LotteryCardSkeleton = () => {
  return (
    <Card className="overflow-hidden p-0 border-muted gap-4">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="w-full h-full rounded-b-none" />
      </div>

      {/* Content Section */}
      <CardContent className="px-2 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Price and Pieces Row */}

        <Skeleton className="h-4 w-16" />

        {/* Draw Date Row */}

        <Skeleton className="h-4 w-32" />

        {/* Slots Row */}

        <Skeleton className="h-4 w-28" />
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="px-2 pb-3 grid grid-cols-2 gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
};

const LotteryGridSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {[...Array(count)].map((_, index) => (
        <LotteryCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default LotteryGridSkeleton;
