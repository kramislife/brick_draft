import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DraftPartCard from "./DraftPartCard";

const PartsGrid = ({
  lotteryData,
  currentDrafter,
  currentUser,
  onPartPick,
  pickedParts = [],
  // Parts data props
  allParts = [],
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  error = null,
  // Infinite scroll props
  lastElementRef,
  // Computed values
  isCurrentUserTurn = false,
  availableParts = [],
}) => {
  const handlePartClick = (part) => {
    if (isCurrentUserTurn) {
      onPartPick(part);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <Skeleton key={index} className="h-48 rounded-xl bg-slate-700/50" />
      ))}
    </div>
  );

  return (
    <div className="col-span-6">
      <div className="h-[calc(100vh-160px)] flex flex-col">
        {/* Parts Grid */}
        <Card className="flex-1 bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Available Parts</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 max-h-[calc(100vh-260px)]">
              {/* Initial loading */}
              {isLoading && <LoadingSkeleton />}

              {/* Parts grid */}
              {availableParts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {availableParts.map((part, index) => (
                      <motion.div
                        key={`${part._id}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.01 }}
                      >
                        <DraftPartCard
                          part={part}
                          onClick={() => handlePartClick(part)}
                          disabled={!isCurrentUserTurn}
                          isPicked={
                            pickedParts.includes(part._id.toString()) ||
                            pickedParts.includes(part._id)
                          }
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Loading more indicator */}
              {isLoadingMore && (
                <div className="mt-6">
                  <div className="text-center py-2 text-gray-400 text-sm mb-4">
                    <p>Loading more parts...</p>
                  </div>
                  <LoadingSkeleton />
                </div>
              )}

              {/* No more data indicator */}
              {!hasMore && availableParts.length > 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  <p>All parts loaded ({availableParts.length} total)</p>
                </div>
              )}

              {/* Invisible trigger for infinite scroll */}
              {hasMore && <div ref={lastElementRef} className="h-1" />}

              {/* Empty State */}
              {!isLoading &&
                !isLoadingMore &&
                availableParts.length === 0 &&
                !error && (
                  <div className="text-center text-gray-400 py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold mb-2">
                      All parts have been picked!
                    </p>
                    <p className="text-sm">
                      The draft is complete - all parts have been distributed
                    </p>
                  </div>
                )}

              {/* Error State */}
              {error && (
                <div className="text-center text-red-400 py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">
                    Failed to load parts
                  </p>
                  <p className="text-sm">Please try refreshing the page</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartsGrid;
