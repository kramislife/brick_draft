import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const PartItemCardSkeleton = () => {
  return (
    <Card className="p-0 rounded">
      <CardContent className="flex flex-row items-start gap-2 py-1 px-1">
        {/* Image Section */}
        <div className="flex-shrink-0 rounded p-0.5 flex items-center justify-center w-23 h-23">
          <Skeleton className="w-full h-full rounded" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col pt-1 pb-1 flex-1">
          {/* Title Row - ID • Name */}
          <div className="flex items-center gap-1 mb-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-32" />
          </div>

          {/* Quantity and Total Value Row */}
          <div className="flex flex-wrap gap-2 mb-2">
            <Skeleton className="h-5 w-16" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>

          {/* Color and Category Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-5 w-20" />

            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PartItemCardSkeletonList = ({ count = 5 }) => {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, index) => (
        <PartItemCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default PartItemCardSkeletonList;
