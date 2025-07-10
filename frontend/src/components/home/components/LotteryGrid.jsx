import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import LotteryCard from "@/components/home/components/LotteryCard";
import LotterySort from "@/components/home/components/LotterySort";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { SORT_OPTIONS } from "@/constant/sortOption";
import { useGetLotteriesQuery } from "@/redux/api/lotteryApi";

const LotteryGrid = ({ title, showViewAll = false, limit }) => {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.FEATURED);
  const {
    data: lotteriesData,
    isLoading,
    error,
  } = useGetLotteriesQuery({ sortBy });
  const lotteries = lotteriesData?.lotteries || [];

  const transformedLotteries = lotteries.map((lottery) => ({
    id: lottery._id,
    name: lottery.title,
    description: lottery.description,
    image: lottery.image?.url || "",
    theme: lottery.collection?.name || "Unknown",
    features: lottery.formattedTag || [],
    price: lottery.ticketPrice,
    pieces: lottery.pieces,
    drawDate: lottery.formattedDrawDate || "TBD",
    drawTime: lottery.formattedDrawTime || "",
    totalSlots: lottery.totalSlots,
    slotsAvailable: lottery.totalSlots,
    dateAdded: lottery.createdAt,
    tag: lottery.tag,
    whyCollect: lottery.whyCollect,
    parts: lottery.parts || [],
  }));

  // Apply limit from LotterySet.jsx
  const limitedData = limit
    ? transformedLotteries.slice(0, limit)
    : transformedLotteries;

  const hasMoreSets = limit && transformedLotteries.length > limit;
  const hasNoData = !isLoading && limitedData.length === 0;

  if (isLoading) {
    return (
      <section className="py-10 px-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-md mb-3"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 px-5">
        <FallbackStates
          icon={Package}
          title="Error Loading Lottery Sets"
          description="Failed to load lottery sets. Please try again later."
          className="min-h-[500px]"
        />
      </section>
    );
  }

  return (
    <section className="py-10 px-5">
      {hasNoData ? (
        <FallbackStates
          icon={Package}
          title="No Lottery Sets Available"
          description="New lottery sets are coming soon! Check back later for exciting opportunities."
          className="min-h-[500px]"
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
            <div className="flex items-center">
              <LotterySort sortBy={sortBy} onSortChange={setSortBy} />
              {showViewAll && hasMoreSets && (
                <Button
                  asChild
                  variant="link"
                  className="gap-1 inline-flex items-center [&_svg:not([class*='size-'])]:size-4 hover:text-accent hover:no-underline"
                >
                  <Link to="/lottery/all">
                    View All
                    <ArrowRight />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {limitedData.map((set) => (
              <LotteryCard key={set.id} set={set} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
export default LotteryGrid;
