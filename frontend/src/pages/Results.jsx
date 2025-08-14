import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Trophy, DollarSign, Package, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import AnimatedBackground from "@/components/ui/animated-background";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import {
  useGetAllCompletedDraftResultsQuery,
  useGetDraftResultByIdQuery,
} from "@/redux/api/draftResultApi";
import { selectCurrentUser } from "@/redux/features/authSlice";

const Results = () => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentUser = useSelector(selectCurrentUser);

  // Fetch all completed draft results (public)
  const {
    data: allResultsData,
    isLoading: isAllResultsLoading,
    error: allResultsError,
  } = useGetAllCompletedDraftResultsQuery();

  // Fetch detailed result when dialog opens
  const { data: detailedResult, isLoading: isDetailedLoading } =
    useGetDraftResultByIdQuery(selectedResult?._id, {
      skip: !selectedResult?._id,
    });

  const handleResultClick = (result, selectedTicket = null) => {
    setSelectedResult({ ...result, selectedTicket });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedResult(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderUserCard = (ticket, result, index, isCurrentUser = false) => {
    const isCurrentUserResult =
      currentUser && ticket.user_id._id === currentUser._id;

    return (
      <div
        key={ticket.ticket_id}
        className={`relative ${isCurrentUserResult ? "order-first" : ""}`}
      >
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
            isCurrentUserResult
              ? "ring-2 ring-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 scale-105"
              : "bg-slate-800/50 border-slate-600 hover:border-slate-500"
          }`}
          onClick={() => handleResultClick(result, ticket)}
        >
          <CardContent className="p-4">
            {/* Current User Badge */}
            {isCurrentUserResult && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <User className="w-3 h-3 mr-1" />
                  YOU
                </Badge>
              </div>
            )}

            {/* User Info - Simplified */}
            <div className="flex items-center gap-3">
              <Avatar
                className={`w-12 h-12 ${
                  isCurrentUserResult ? "ring-2 ring-blue-400" : ""
                }`}
              >
                <AvatarImage src={ticket.user_id.profile_picture?.url} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {ticket.user_id.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3
                  className={`font-bold text-lg ${
                    isCurrentUserResult ? "text-blue-300" : "text-white"
                  }`}
                >
                  {ticket.user_id.name}
                </h3>
                <p className="text-sm text-gray-400">
                  Ticket: {ticket.ticket_id}
                </p>
              </div>
            </div>

            {/* Click to View Message */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">Click to view won parts</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDetailedDialog = () => {
    if (!detailedResult?.draftResult) return null;

    const result = detailedResult.draftResult;
    const selectedTicket = selectedResult?.selectedTicket;

    return (
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {result.lottery.set_name} -{" "}
              {selectedTicket?.user_id.name || "Draft Results"}
            </DialogTitle>
            <p className="text-center text-gray-400">
              Completed on {formatDate(result.completed_at)}
            </p>
          </DialogHeader>

          {isDetailedLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected User Info */}
              {selectedTicket && (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16 ring-2 ring-blue-400">
                      <AvatarImage
                        src={selectedTicket.user_id.profile_picture?.url}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                        {selectedTicket.user_id.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">
                        {selectedTicket.user_id.name}
                      </h3>
                      <p className="text-gray-400">
                        Ticket: {selectedTicket.ticket_id}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">
                            Parts Won: {selectedTicket.total_parts_won}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">
                            Total Value: $
                            {selectedTicket.total_value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {currentUser &&
                      selectedTicket.user_id._id === currentUser._id && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          <User className="w-4 h-4 mr-1" />
                          YOU
                        </Badge>
                      )}
                  </div>
                </div>
              )}

              {/* Won Parts List */}
              {selectedTicket && selectedTicket.won_parts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Won Parts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedTicket.won_parts.map((wonPart, partIndex) => (
                      <Card
                        key={partIndex}
                        className="bg-slate-800/50 border-slate-600"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              {wonPart.part_id?.item_image?.url ? (
                                <img
                                  src={wonPart.part_id.item_image.url}
                                  alt={wonPart.part_id.name}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              ) : (
                                <span className="text-lg">🧱</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white truncate">
                                {wonPart.part_id?.name || "Part"}
                              </h4>
                              <p className="text-xs text-gray-400">
                                Round {wonPart.round_number}
                              </p>
                              {wonPart.part_id?.color?.color_name && (
                                <div className="flex items-center gap-1 mt-1">
                                  <div
                                    className="w-3 h-3 rounded-full border border-white/30"
                                    style={{
                                      backgroundColor:
                                        wonPart.part_id.color.hex_code ||
                                        "#6b7280",
                                    }}
                                  />
                                  <span className="text-xs text-gray-400">
                                    {wonPart.part_id.color.color_name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                              Value: $
                              {(
                                wonPart.part_id?.total_value || 0
                              ).toLocaleString()}
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-slate-700 text-slate-300"
                            >
                              {wonPart.part_id?.category_name || "Part"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* No Parts Message */}
              {selectedTicket && selectedTicket.won_parts.length === 0 && (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    No Parts Won
                  </h3>
                  <p className="text-gray-400">
                    This user didn't win any parts in this draft.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  const renderContent = () => {
    if (isAllResultsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      );
    }

    if (allResultsError) {
      return (
        <FallbackStates
          icon={Trophy}
          title="Error Loading Results"
          description="Failed to load draft results. Please try again later."
          className="min-h-[500px]"
        />
      );
    }

    if (!allResultsData?.categorizedResults?.length) {
      return (
        <FallbackStates
          icon={Trophy}
          title="No Results Available"
          description="No completed draft results found yet."
          className="min-h-[500px]"
        />
      );
    }

    return (
      <div className="space-y-10">
        {allResultsData.categorizedResults.map((category) => (
          <div key={category.lottery.id}>
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {category.lottery.name}
                </h2>
                <p className="text-gray-400">
                  {category.results.length} completed draft
                  {category.results.length !== 1 ? "s" : ""} •{" "}
                  {formatDate(category.results[0]?.completed_at)}
                </p>
              </div>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.results.map((result) =>
                [...result.ticket_results]
                  .sort((a, b) => {
                    // Current user always first
                    if (currentUser) {
                      const aIsCurrentUser = a.user_id._id === currentUser._id;
                      const bIsCurrentUser = b.user_id._id === currentUser._id;
                      if (aIsCurrentUser && !bIsCurrentUser) return -1;
                      if (!aIsCurrentUser && bIsCurrentUser) return 1;
                    }
                    // Then sort by value (highest first)
                    return b.total_value - a.total_value;
                  })
                  .map((ticket, index) =>
                    renderUserCard(
                      ticket,
                      result,
                      index,
                      currentUser && ticket.user_id._id === currentUser._id
                    )
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen p-5">
        {/* Header - Only show if there's data */}
        {!isAllResultsLoading &&
          allResultsData?.categorizedResults?.length > 0 && (
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-black" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Draft Results
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Explore completed LEGO draft results and see how participants
                performed
              </p>
            </div>
          )}

        {/* Content */}
        <div>{renderContent()}</div>
      </div>

      {/* Detailed Result Dialog */}
      {renderDetailedDialog()}
    </div>
  );
};

export default Results;
