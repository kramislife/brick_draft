import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Trophy,
  Calendar,
  Users,
  Package,
  User,
  ArrowLeft,
  DollarSign,
  Clock,
  ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/ui/animated-background";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { useGetDraftResultByIdQuery } from "@/redux/api/draftResultApi";
import { selectCurrentUser } from "@/redux/features/authSlice";

const ResultsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  // Fetch detailed draft result
  const {
    data: resultData,
    isLoading: isResultLoading,
    error: resultError,
  } = useGetDraftResultByIdQuery(id, {
    skip: !id,
  });

  const result = resultData?.draftResult;
  const ticketResults = result?.ticket_results || [];

  const handleBackClick = () => {
    navigate("/results");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group parts by user instead of by ticket
  const groupPartsByUser = () => {
    const userGroups = {};

    ticketResults.forEach((ticket) => {
      const userId = ticket.user_id._id;
      const userName = ticket.user_id.name || "Unknown User";
      const userProfile = ticket.user_id.profile_picture;
      const userEmail = ticket.user_id.email;

      if (!userGroups[userId]) {
        userGroups[userId] = {
          user: {
            _id: userId,
            name: userName,
            profile_picture: userProfile,
            email: userEmail,
          },
          tickets: [],
          totalValue: 0,
          totalParts: 0,
          allParts: [],
        };
      }

      const wonParts = ticket.won_parts || [];
      const ticketValue = ticket.total_value || 0;
      const ticketPartsCount = ticket.total_parts_won || 0;

      userGroups[userId].tickets.push({
        ticket_id: ticket.ticket_id,
        total_value: ticketValue,
        total_parts_won: ticketPartsCount,
      });

      userGroups[userId].totalValue += ticketValue;
      userGroups[userId].totalParts += ticketPartsCount;

      // Add parts to the user's collection
      wonParts.forEach((wonPart) => {
        userGroups[userId].allParts.push({
          ...wonPart.part_id,
          round_number: wonPart.round_number,
          pick_time: wonPart.pick_time,
          pick_method: wonPart.pick_method,
        });
      });
    });

    // Sort user groups: current user first, then by total value (descending)
    const sortedUserGroups = Object.values(userGroups).sort((a, b) => {
      // Current user always first
      if (currentUser && a.user._id === currentUser._id) return -1;
      if (currentUser && b.user._id === currentUser._id) return 1;

      // Then sort by total value (descending)
      return b.totalValue - a.totalValue;
    });

    return sortedUserGroups;
  };

  const userGroups = groupPartsByUser();

  // Loading state
  if (isResultLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden relative">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Loading Results...
          </h3>
          <p className="text-gray-300">
            Please wait while we fetch the detailed results.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (resultError || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 px-5 py-10">
          <FallbackStates
            icon={Trophy}
            title="Result Not Found"
            description="The requested draft result could not be found or has been removed."
            className="min-h-[500px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={handleBackClick}
            variant="ghost"
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-5">
              <Trophy className="w-10 h-10 text-yellow-500" />
              <h1 className="text-4xl font-bold text-white">
                {result.lottery?.set_name || "Draft Results"}
              </h1>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Detailed results showing which parts each participant won during
              the draft
            </p>
          </div>

          {/* Draft Stats */}
          <Card className="bg-slate-800/50 border-slate-600 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400 text-sm">Participants</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {result.draft_stats?.total_participants || 0}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400 text-sm">
                      Parts Distributed
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {result.draft_stats?.total_parts_distributed || 0}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm">Total Value</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    $
                    {(
                      result.draft_stats?.total_value_distributed || 0
                    ).toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-400 text-sm">Completed</span>
                  </div>
                  <div className="text-sm text-white">
                    {formatDate(result.completed_at)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participant Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Participant Results
          </h2>

          {userGroups.length === 0 ? (
            <FallbackStates
              icon={User}
              title="No Participants"
              description="No participant results found for this draft."
              className="min-h-[300px]"
            />
          ) : (
            userGroups.map((userGroup, index) => {
              const isCurrentUser =
                currentUser && userGroup.user._id === currentUser._id;
              const userParts = userGroup.allParts || [];

              return (
                <Card
                  key={userGroup.user._id}
                  className={`bg-slate-800/50 border-slate-600 ${
                    isCurrentUser ? "ring-2 ring-blue-500/50" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    {/* User Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={userGroup.user.profile_picture?.url}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {userGroup.user.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">
                              {userGroup.user.name || "Unknown User"}
                            </h3>
                            {isCurrentUser && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                <User className="w-3 h-3 mr-1" />
                                YOU
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-gray-400 text-sm">
                            <span>
                              {userGroup.tickets.length} ticket
                              {userGroup.tickets.length > 1 ? "s" : ""}
                            </span>
                            <span>•</span>
                            <span>{userGroup.totalParts} parts won</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          ${userGroup.totalValue.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-sm">
                          Total Value Won
                        </div>
                      </div>
                    </div>

                    {/* Won Parts Grid using DraftPartCard */}
                    {userParts.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No parts won in this draft</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {userParts.map((part, partIndex) => (
                          <div
                            key={`${userGroup.user._id}-${partIndex}`}
                            className="relative"
                          >
                            {/* Custom Part Card for Results - No Quantity/Value */}
                            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 overflow-hidden border-gray-600">
                              <div className="relative p-4 h-full flex flex-col">
                                {/* Part Image */}
                                <div className="relative mb-3 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                                  {part.item_image?.url ? (
                                    <img
                                      src={part.item_image.url}
                                      alt={part.name}
                                      className="w-full h-full object-contain transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 flex items-center justify-center">
                                      <ImageIcon className="w-6 h-6 text-slate-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Part Info */}
                                <div className="flex-1 flex flex-col">
                                  {/* Part Name */}
                                  <h3
                                    className="text-white font-bold text-sm mb-2 overflow-hidden"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  >
                                    {part.name || "Unknown Part"}
                                  </h3>

                                  {/* Category & Color */}
                                  <div className="flex items-center gap-2 mb-3 min-h-[20px]">
                                    {part.color?.color_name ? (
                                      <div className="flex items-center gap-1">
                                        <div
                                          className="w-3 h-3 rounded-full border border-white/30"
                                          style={{
                                            backgroundColor:
                                              part.color.hex_code || "#6b7280",
                                          }}
                                        />
                                        <span className="text-xs text-slate-400">
                                          {part.color.color_name}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full border border-white/30 bg-slate-600" />
                                        <span className="text-xs text-slate-500">
                                          No color
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDetails;
