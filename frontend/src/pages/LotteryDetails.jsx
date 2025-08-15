import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Package } from "lucide-react";
import LotteryImageSection from "@/components/lottery-details/LotteryImageSection";
import LotteryWhyCollect from "@/components/lottery-details/LotteryWhyCollect";
import LotteryStatsCards from "@/components/lottery-details/LotteryStatsCards";
import LotteryPurchaseSection from "@/components/lottery-details/LotteryPurchaseSection";
import { paymentMethod, deliveryMethod } from "@/constant/paymentMethod";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import LotteryPartsSection from "@/components/lottery-details/LotteryPartsSection";
import {
  useGetLotteryByIdQuery,
  useGetLotteryPartsByIdQuery,
} from "@/redux/api/lotteryApi";

import { selectCurrentUser } from "@/redux/features/authSlice";

const LotteryDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [paginationParams, setPaginationParams] = useState({
    sort: "name", // Set initial sort to trigger proper sorting from the start
    page: 1,
    limit: 20,
  });

  // Fetch lottery details
  const {
    data: lotteryData,
    isLoading: isLotteryLoading,
    error: lotteryError,
  } = useGetLotteryByIdQuery(id);

  // Fetch parts data
  const {
    data: partsData,
    isLoading: isPartsLoading,
    error: partsError,
  } = useGetLotteryPartsByIdQuery(
    {
      id,
      params: paginationParams,
    },
    {
      // Skip the query if we don't have the lottery ID yet
      skip: !id,
    }
  );

  // Extract parts data from backend response
  const parts = partsData?.parts || [];
  const totalParts = partsData?.totalParts || 0;
  const totalPages = partsData?.totalPages || 1;
  const currentPage = partsData?.page || 1;

  // Context-aware filter options
  const categoryOptions = partsData?.availableCategories || [];
  const colorOptions = partsData?.availableColors || [];

  // Transform lottery data
  const set = useMemo(() => {
    if (!lotteryData?.lottery) return null;
    const lottery = lotteryData.lottery;
    return {
      id: lottery._id,
      name: lottery.title,
      description: lottery.description,
      image: lottery.image?.url || "",
      theme: lottery.collection?.name || "Unknown",
      features: lottery.formattedTag || [],
      price: lottery.ticketPrice,
      marketPrice: lottery.marketPrice,
      pieces: lottery.pieces,
      drawDate: lottery.formattedDrawDate || "TBD",
      drawTime: lottery.formattedDrawTime || "",
      totalSlots: lottery.totalSlots,
      slotsAvailable: lottery.slotsAvailable,
      whyCollect: lottery.whyCollect || [],
      parts: lottery.parts || [],
    };
  }, [lotteryData]);

  const user = useSelector(selectCurrentUser);

  if (isLotteryLoading) {
    return (
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-[600px] rounded-xl"></div>
          </div>
          <div className="space-y-5">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-8 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
            <div className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-24 rounded"></div>
                ))}
              </div>
            </div>
            <div className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (lotteryError || !set) {
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
          <LotteryImageSection set={set} />
        </div>

        {/* Details Section */}
        <div className="space-y-5 font-[Inter]">
          <div className="space-y-2">
            <h1 className="hidden lg:block text-4xl font-bold">{set.name}</h1>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {set.description}
            </p>
          </div>

          <LotteryWhyCollect set={set} />
          <LotteryStatsCards set={set} />
          <LotteryPurchaseSection
            set={set}
            quantity={quantity}
            setQuantity={setQuantity}
            paymentMethod={paymentMethod}
            deliveryMethod={deliveryMethod}
            userEmail={user?.email}
            lottery_status={lotteryData?.lottery?.lottery_status}
          />
        </div>
      </div>

      {/* Parts Section */}
      <LotteryPartsSection
        partsTitle={set.name + " Parts"}
        paginatedParts={parts}
        totalParts={totalParts}
        startEntry={partsData?.startEntry || 1}
        endEntry={partsData?.endEntry || totalParts}
        totalPages={totalPages}
        currentPage={currentPage}
        categoryOptions={categoryOptions}
        colorOptions={colorOptions}
        isLoading={isPartsLoading}
        drawDate={set.drawDate}
        onParamsChange={setPaginationParams}
      />
    </div>
  );
};

export default LotteryDetails;
