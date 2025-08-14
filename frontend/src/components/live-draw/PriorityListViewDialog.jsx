import React from "react";
import { ListTodo, Package, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DraftPartCard from "./DraftPartCard";

const PriorityListViewDialog = ({
  open,
  onClose,
  pickedParts = [],
  pickHistory = [],
  priorityData,
  isLoading,
  error,
  hasValidPurchaseId,
  currentUser,
}) => {
  const priorityList = priorityData?.priorityList?.priorityItems || [];
  const hasPriorityList = priorityList.length > 0;

  // Get current user's picked parts from pickHistory
  const userPickedParts = pickHistory.filter(
    (pick) => pick.user?._id === currentUser?._id
  );

  // Get priority list part IDs to avoid duplication
  const priorityListPartIds = new Set(
    priorityList.map((item) => item.item._id)
  );

  // Filter out parts that are already in priority list
  const userPickedPartsExcludingPriority = userPickedParts.filter(
    (pick) => !priorityListPartIds.has(pick.part._id)
  );

  const hasUserPickedParts = userPickedPartsExcludingPriority.length > 0;

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 p-4"
        >
          <Skeleton className="h-24 w-full rounded-lg bg-gray-700 mb-3" />
          <Skeleton className="h-4 w-3/4 bg-gray-700 mb-2" />
          <Skeleton className="h-3 w-1/2 bg-gray-700 mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16 bg-gray-700" />
            <Skeleton className="h-6 w-20 bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
        <ListTodo className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">
        No Priority List Set
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
        You haven't set up your priority list yet. Create one to get your
        favorite parts first during the draft!
      </p>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
        <Package className="w-10 h-10 text-red-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">
        Failed to Load Priority List
      </h3>
      <p className="text-gray-400 mb-8">
        {error?.data?.message || "Something went wrong. Please try again."}
      </p>
    </div>
  );

  // Function to get pick info for a part
  const getPickInfo = (partId) => {
    return pickHistory.find((pick) => pick.part?._id === partId);
  };

  // Function to check if part is picked by current user
  const isPickedByCurrentUser = (partId) => {
    const pickInfo = getPickInfo(partId);
    return pickInfo && pickInfo.user?._id === currentUser?._id;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white pb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            Draft Overview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Priority List Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Priority List</h3>
              {hasPriorityList && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {priorityList.length} items
                </Badge>
              )}
            </div>

            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorState />
            ) : !hasValidPurchaseId ? (
              <EmptyState />
            ) : !hasPriorityList ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {priorityList.map((item, index) => {
                  const part = item.item;
                  const isPicked =
                    pickedParts.includes(part._id?.toString()) ||
                    pickedParts.includes(part._id);
                  const pickInfo = getPickInfo(part._id);
                  const pickedByCurrentUser = isPickedByCurrentUser(part._id);

                  return (
                    <div key={`${part._id}-${index}`} className="relative">
                      {/* Priority Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 font-bold">
                          #{item.priority}
                        </Badge>
                      </div>

                      {/* Pick Status Badge */}
                      {isPicked && (
                        <div className="absolute top-2 right-2 z-10">
                          {pickedByCurrentUser ? (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                              Picked by You
                            </Badge>
                          ) : (
                            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
                              Picked by {pickInfo?.user?.name || "Unknown"}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Use the actual DraftPartCard component */}
                      <DraftPartCard
                        part={part}
                        isPicked={isPicked}
                        disabled={true}
                        onClick={() => {}} // No-op since it's disabled
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Picked Parts Section */}
          {hasUserPickedParts && (
            <div className="border-t border-gray-700 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Your Picked Parts
                </h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {userPickedPartsExcludingPriority.length} items
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPickedPartsExcludingPriority.map((pick, index) => {
                  const part = pick.part;

                  return (
                    <div key={`${part._id}-${index}`} className="relative">
                      {/* Picked Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                          Picked by You
                        </Badge>
                      </div>

                      {/* Use the actual DraftPartCard component */}
                      <DraftPartCard
                        part={part}
                        isPicked={true}
                        disabled={true}
                        onClick={() => {}} // No-op since it's disabled
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Picked Parts Message */}
          {!hasUserPickedParts && hasPriorityList && (
            <div className="border-t border-gray-700 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Your Picked Parts
                </h3>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Trophy className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400">
                  You haven't picked any additional parts yet. Your picks will
                  appear here once you start drafting!
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriorityListViewDialog;
