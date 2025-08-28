import React from "react";
import { Package } from "lucide-react";
import LotteryImageSection from "@/components/lottery-details/LotteryImageSection";
import LotteryWhyCollect from "@/components/lottery-details/LotteryWhyCollect";
import LotteryStatsCards from "@/components/lottery-details/LotteryStatsCards";
import LotteryPurchaseSection from "@/components/lottery-details/LotteryPurchaseSection";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import LotteryDetailsSkeleton from "@/components/layout/fallback/LotteryDetailsSkeleton";
import LotteryPartsSection from "@/components/lottery-details/LotteryPartsSection";
import { useLotteryDetails } from "@/hooks/useLottery";

const LotteryDetails = () => {
  const {
    isLotteryLoading,
    hasNoData,
    quantity,
    set,
    lotteryData,
    user,
    setQuantity,
    lotteryId,
  } = useLotteryDetails();

  if (isLotteryLoading) {
    return <LotteryDetailsSkeleton />;
  }

  if (hasNoData) {
    return (
      <div className="p-5">
        <FallbackStates
          icon={Package}
          title="Lottery Not Found"
          description="The lottery you're looking for doesn't exist or has been removed."
          className="min-h-[500px]"
        />
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Image Section */}
        <div className="lg:sticky lg:top-23 lg:h-fit self-start">
          <LotteryImageSection
            image={set.image}
            name={set.name}
            theme={set.theme}
            features={set.features}
          />
        </div>

        {/* Details Section */}
        <div className="space-y-5 font-[Inter]">
          <div className="space-y-2">
            <h1 className="hidden lg:block text-4xl font-bold">{set.name}</h1>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {set.description}
            </p>
          </div>

          <LotteryWhyCollect whyCollect={set.whyCollect} />

          <LotteryStatsCards
            marketPrice={set.marketPrice}
            drawDate={set.drawDate}
            drawTime={set.drawTime}
            pieces={set.pieces}
          />

          <LotteryPurchaseSection
            lotteryId={set.id}
            price={set.price}
            quantity={quantity}
            setQuantity={setQuantity}
            userEmail={user?.email}
            lottery_status={lotteryData?.lottery?.lottery_status}
            isTicketSalesClosed={lotteryData?.lottery?.isTicketSalesClosed}
            lotteryName={set.name}
          />
        </div>
      </div>

      {/* Parts Section */}
      <LotteryPartsSection
        lotteryId={lotteryId}
        partsTitle={set.name + " Parts"}
        drawDate={set.drawDate}
      />
    </div>
  );
};

export default LotteryDetails;
