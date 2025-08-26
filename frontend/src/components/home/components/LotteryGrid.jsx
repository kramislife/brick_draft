import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import LotteryCard from "@/components/home/components/LotteryCard";
import LotterySort from "@/components/home/components/LotterySort";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import LotteryGridSkeleton from "@/components/layout/fallback/LotteryGridSkeleton";
import { useLottery } from "@/hooks/useLottery";

const LotteryGrid = ({ title, showViewAll = false, limit }) => {
  const {
    isLoading,
    error,
    hasNoData,
    limitedData,
    getLotteryCardProps,
    lotterySortProps,
    viewAllButtonProps,
  } = useLottery({ title, showViewAll, limit });

  if (isLoading) {
    return (
      <section className="py-10 px-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        </div>
        <LotteryGridSkeleton count={4} />
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

  if (hasNoData) {
    return (
      <section className="py-10 px-5">
        <FallbackStates
          icon={Package}
          title="No Lottery Sets Available"
          description="New lottery sets are coming soon! Check back later for exciting opportunities."
          className="min-h-[500px]"
        />
      </section>
    );
  }

  return (
    <section className="py-10 px-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex items-center">
          <LotterySort {...lotterySortProps} />
          {viewAllButtonProps.show && (
            <Button
              asChild
              variant="link"
              className="gap-1 inline-flex items-center [&_svg:not([class*='size-'])]:size-4 hover:text-accent hover:no-underline"
            >
              <Link to={viewAllButtonProps.href}>
                View All
                <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {limitedData.map((set) => (
          <LotteryCard key={set.id} {...getLotteryCardProps(set)} />
        ))}
      </div>
    </section>
  );
};

export default LotteryGrid;
