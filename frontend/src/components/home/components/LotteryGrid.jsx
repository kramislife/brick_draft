import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import LotteryCard from "@/components/home/components/LotteryCard";
import LotterySort from "@/components/home/components/LotterySort";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { useGetPublicLotteriesQuery } from "@/redux/api/publicApi";

export const SORT_OPTIONS = {
  FEATURED: "Featured",
  BEST_SELLER: "Best Seller",
  NEW_ARRIVAL: "New Arrival",
  LIMITED_EDITION: "Limited Edition",
  ENDING_SOON: "Ending Soon",
  DRAW_DATE: "Draw Date",
  NEWLY_ADDED: "Newly Added",
  PRICE_LOW_HIGH: "Price: Low to High",
  PRICE_HIGH_LOW: "Price: High to Low",
};

const LotteryGrid = ({ title, showViewAll = false, limit }) => {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.FEATURED);
  const {
    data: lotteriesData,
    isLoading,
    error,
  } = useGetPublicLotteriesQuery();
  const lotteries = lotteriesData?.lotteries || [];

  // Format draw date for display
  const formatDrawDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "TBD";
    }
  };

  // Format draw time for display with EST timezone
  const formatDrawTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return (
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }) + " EST"
      );
    } catch {
      return "";
    }
  };

  // Transform lottery data to match the expected format
  const transformedLotteries = lotteries.map((lottery) => ({
    id: lottery._id,
    name: lottery.title,
    description: lottery.description,
    image: lottery.image?.url || "",
    theme: lottery.collection?.name || "Unknown",
    features: lottery.tag
      ? [
          lottery.tag
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        ]
      : [],
    price: lottery.ticketPrice,
    pieces: lottery.pieces,
    drawDate: formatDrawDate(lottery.drawDate),
    drawTime: formatDrawTime(lottery.drawTime),
    totalSlots: lottery.totalSlots,
    slotsAvailable: lottery.totalSlots, // Assuming all slots are available initially
    dateAdded: lottery.createdAt,
    tag: lottery.tag,
    whyCollect: lottery.whyCollect,
    parts: lottery.parts || [],
  }));

  // Sort data based on selected option
  const sortedData = [...transformedLotteries].sort((a, b) => {
    if (sortBy === SORT_OPTIONS.FEATURED) {
      return b.features.includes("Featured") - a.features.includes("Featured");
    }
    if (sortBy === SORT_OPTIONS.BEST_SELLER) {
      return (
        b.features.includes("Best Seller") - a.features.includes("Best Seller")
      );
    }
    if (sortBy === SORT_OPTIONS.NEW_ARRIVAL) {
      return (
        b.features.includes("New Arrival") - a.features.includes("New Arrival")
      );
    }
    if (sortBy === SORT_OPTIONS.LIMITED_EDITION) {
      return (
        b.features.includes("Limited Edition") -
        a.features.includes("Limited Edition")
      );
    }
    if (
      sortBy === SORT_OPTIONS.ENDING_SOON ||
      sortBy === SORT_OPTIONS.DRAW_DATE
    ) {
      return new Date(a.drawDate) - new Date(b.drawDate);
    }
    if (sortBy === SORT_OPTIONS.NEWLY_ADDED) {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
    if (sortBy === SORT_OPTIONS.PRICE_LOW_HIGH) {
      return a.price - b.price;
    }
    if (sortBy === SORT_OPTIONS.PRICE_HIGH_LOW) {
      return b.price - a.price;
    }
    return 0;
  });

  // Apply limit if specified
  const limitedData = limit ? sortedData.slice(0, limit) : sortedData;

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
