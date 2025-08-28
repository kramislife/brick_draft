import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LotteryDetailsSkeleton = () => {
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Image Section Skeleton */}
        <div className="lg:sticky lg:top-23 lg:h-fit self-start">
          <Card className="p-0 border-muted">
            <CardContent className="p-0">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Skeleton className="w-full h-full" />
                {/* Badge skeletons */}
                <div className="absolute top-4 left-4">
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
                <div className="absolute top-4 right-4 space-x-2">
                  <Skeleton className="w-20 h-6 rounded-full" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Section Skeleton */}
        <div className="space-y-5 font-[Inter]">
          {/* Title and Description */}
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-10" />
            <Skeleton className="w-full h-4" />
          </div>

          {/* Why Collect Section */}
          <Card className="border-muted">
            <CardContent className="p-5">
              <Skeleton className="w-32 h-6 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                    <Skeleton className="w-full h-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-muted">
                <CardContent className="relative px-5">
                  <div className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-muted rounded-full"></div>
                  <Skeleton className="w-6 h-6 mb-2" />
                  <Skeleton className="w-20 h-4 mb-2" />
                  <Skeleton className="w-16 h-8 mb-2" />
                  <Skeleton className="w-24 h-3" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Purchase Section */}
          <Card className="border-muted">
            <CardContent className="p-5">
              <Skeleton className="w-32 h-6 mb-4" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-20 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="w-24 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-16 h-6" />
                </div>
                <div className="border-t border-muted pt-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-24 h-6" />
                    <Skeleton className="w-20 h-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LotteryDetailsSkeleton;

