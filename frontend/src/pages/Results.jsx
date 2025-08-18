import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Calendar, Users, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedBackground from "@/components/ui/animated-background";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { useGetAllCompletedDraftResultsQuery } from "@/redux/api/draftResultApi";

const Results = () => {
  const navigate = useNavigate();
  const [selectedResult, setSelectedResult] = useState(null);

  // Fetch all completed draft results
  const {
    data: allResultsData,
    isLoading: isAllResultsLoading,
    error: allResultsError,
  } = useGetAllCompletedDraftResultsQuery();

  const completedResults = allResultsData?.categorizedResults || [];

  const handleResultClick = (result) => {
    navigate(`/results/${result._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (isAllResultsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden relative">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Loading Results...
          </h3>
          <p className="text-gray-300">
            Please wait while we fetch the latest results.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (allResultsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 px-5 py-10">
          <FallbackStates
            icon={Trophy}
            title="Error Loading Results"
            description="Failed to load draft results. Please try again later."
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
        {/* Results Grid */}
        {completedResults.length === 0 ? (
          <FallbackStates
            icon={Trophy}
            title="No Results Available"
            description="No completed draft results found. Check back later for completed lotteries."
            className="min-h-[500px]"
          />
        ) : (
          <>
            {/* Header - Only show when there are results */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-5">
                <Trophy className="w-10 h-10 text-yellow-500" />
                <h1 className="text-4xl font-bold text-white">Draft Results</h1>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto">
                View completed lottery draft results and see which parts each
                participant won
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedResults.map((result) => (
                <Card
                  key={result.lottery.id}
                  className="relative overflow-hidden border-none p-0 gap-0 group w-full bg-gradient-to-br from-gray-900 to-gray-800 cursor-pointer"
                  onClick={() => handleResultClick(result.results[0])} // Use the first result for navigation
                >
                  {/* Image Section */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <img
                      src={
                        result.lottery.image?.url || "/placeholder-lottery.jpg"
                      }
                      alt={result.lottery.title || result.lottery.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Title with glow effect */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h3 className="font-bold text-white line-clamp-1">
                        {result.lottery.title ||
                          result.lottery.name ||
                          "Unknown Lottery"}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="py-5">
                    {/* Stats Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Completed</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-slate-700 text-slate-300"
                        >
                          {formatDate(result.results[0]?.completed_at)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Participants</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-slate-700 text-slate-300"
                        >
                          {result.results[0]?.draft_stats?.total_participants ||
                            0}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Package className="w-4 h-4" />
                          <span className="text-sm">Parts Distributed</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-slate-700 text-slate-300"
                        >
                          {result.results[0]?.draft_stats
                            ?.total_parts_distributed || 0}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      <div className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 border border-green-400/40">
                        <Trophy className="w-4 h-4" />
                        <span>View Results</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
