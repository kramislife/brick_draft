import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import LotteryCard from "@/components/home/components/LotteryCard";
import LotterySort from "@/components/home/components/LotterySort";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { lotteryData, PARTS, FEATURES } from "@/constant/data";

export const SORT_OPTIONS = {
  ...FEATURES,
  ENDING_SOON: "Ending Soon",
  DRAW_DATE: "Draw Date",
  NEWLY_ADDED: "Newly Added",
  PRICE_LOW_HIGH: "Price: Low to High",
  PRICE_HIGH_LOW: "Price: High to Low",
};

const LotteryGrid = ({ title, showViewAll = false, limit }) => {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.FEATURED);

  const initialSortedData = [...lotteryData].sort(
    (a, b) =>
      b.features.includes(FEATURES.FEATURED) -
      a.features.includes(FEATURES.FEATURED)
  );

  const limitedData = limit
    ? initialSortedData.slice(0, limit)
    : initialSortedData;

  const sortedData = [...limitedData].sort((a, b) => {
    if (Object.values(FEATURES).includes(sortBy)) {
      return b.features.includes(sortBy) - a.features.includes(sortBy);
    }

    switch (sortBy) {
      case SORT_OPTIONS.ENDING_SOON:
      case SORT_OPTIONS.DRAW_DATE:
        return new Date(a.drawDate) - new Date(b.drawDate);
      case SORT_OPTIONS.NEWLY_ADDED:
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case SORT_OPTIONS.PRICE_LOW_HIGH:
        return a.price - b.price;
      case SORT_OPTIONS.PRICE_HIGH_LOW:
        return b.price - a.price;
      default:
        return (
          b.features.includes(FEATURES.FEATURED) -
          a.features.includes(FEATURES.FEATURED)
        );
    }
  });

  const hasMoreSets = limit && lotteryData.length > limit;
  const hasNoData = sortedData.length === 0;

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
            {sortedData.map((set) => (
              <LotteryCard key={set.id} set={set} PARTS={PARTS} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
export default LotteryGrid;
