import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DraftPartCard from "./DraftPartCard";
import { Badge } from "@/components/ui/badge";

const PartsGrid = ({
  onPartPick,
  pickedParts = [],
  // Parts data props
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  // Infinite scroll props
  lastElementRef,
  // Computed values
  isCurrentUserTurn = false,
  availableParts = [],
  // Auto-pick status props
  autoPickEnabled = false,
  isAutoPicking = false,
  // Guest user prop
  isGuest = false,
  // Total parts count for display
  totalParts = 0,
}) => {
  const handlePartClick = (part) => {
    // ✅ Only allow manual picking when it's user's turn AND auto-pick is disabled
    if (isCurrentUserTurn && !autoPickEnabled && !isAutoPicking) {
      onPartPick(part);
    }
  };

  // Calculate parts statistics
  const pickedCount = pickedParts.length;
  const totalCount = totalParts || availableParts.length + pickedCount;

  // Enhanced loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-slate-700/50 rounded-xl h-48 flex flex-col p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-slate-600 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-600 rounded mb-2"></div>
              <div className="h-3 bg-slate-600 rounded w-2/3"></div>
            </div>
          </div>
          <div className="flex-1 bg-slate-600 rounded-lg mb-3"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-slate-600 rounded w-16"></div>
            <div className="h-6 bg-slate-600 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Enhanced transition skeleton for when parts are being updated
  const TransitionSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-slate-700/30 rounded-xl h-48 flex flex-col p-4 border border-slate-600/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-slate-600/50 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-600/50 rounded mb-2"></div>
              <div className="h-3 bg-slate-600/50 rounded w-2/3"></div>
            </div>
          </div>
          <div className="flex-1 bg-slate-600/50 rounded-lg mb-3"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-slate-600/50 rounded w-16"></div>
            <div className="h-6 bg-slate-600/50 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Determine if we should show transition state (when parts are being updated)
  const isTransitioning =
    !isLoading &&
    !isLoadingMore &&
    availableParts.length === 0 &&
    pickedParts.length > 0;

  return (
    <div className="col-span-6">
      <div className="h-[700px] flex flex-col">
        {/* Parts Grid */}
        <Card className="h-[700px] bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Available Parts</h3>
              {totalCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-auto bg-slate-700 text-slate-300 mr-3"
                >
                  {pickedCount} picked / {totalCount} total
                </Badge>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {/* Initial loading */}
              {isLoading && <LoadingSkeleton />}

              {/* Transition state - when parts are being updated */}
              {isTransitioning && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-blue-400 text-sm font-medium">
                      Updating parts...
                    </p>
                  </div>
                  <TransitionSkeleton />
                </div>
              )}

              {/* Parts grid */}
              {!isLoading && !isTransitioning && availableParts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-1">
                  <AnimatePresence mode="popLayout">
                    {availableParts.map((part, index) => (
                      <motion.div
                        key={`${part._id}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          delay: index * 0.01,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        layout
                      >
                        <DraftPartCard
                          part={part}
                          onClick={() => handlePartClick(part)}
                          disabled={
                            !isCurrentUserTurn ||
                            autoPickEnabled ||
                            isAutoPicking
                          }
                          isPicked={
                            pickedParts.includes(part._id.toString()) ||
                            pickedParts.includes(part._id)
                          }
                          isCurrentUserTurn={isCurrentUserTurn}
                          autoPickEnabled={autoPickEnabled}
                          isAutoPicking={isAutoPicking}
                          isGuest={isGuest}
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
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading more parts...</p>
                    </div>
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

              {/* Empty State - Only show when truly no parts and not transitioning */}
              {!isLoading &&
                !isLoadingMore &&
                !isTransitioning &&
                availableParts.length === 0 && (
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartsGrid;
