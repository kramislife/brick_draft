import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPublicLotteryByIdQuery } from "@/redux/api/publicApi";
import LotteryImageSection from "@/components/lottery-details/LotteryImageSection";
import LotteryWhyCollect from "@/components/lottery-details/LotteryWhyCollect";
import LotteryStatsCards from "@/components/lottery-details/LotteryStatsCards";
import LotteryPurchaseSection from "@/components/lottery-details/LotteryPurchaseSection";
import { paymentMethod } from "@/constant/paymentMethod";
import PartItemCard from "@/components/home/components/PartItemCard";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { Package } from "lucide-react";

const LotteryDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const {
    data: lotteryData,
    isLoading,
    error,
  } = useGetPublicLotteryByIdQuery(id);

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
  const transformLotteryData = (lottery) => {
    if (!lottery) return null;

    return {
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
      marketPrice: lottery.marketPrice,
      pieces: lottery.pieces,
      drawDate: formatDrawDate(lottery.drawDate),
      drawTime: formatDrawTime(lottery.drawTime),
      totalSlots: lottery.totalSlots,
      slotsAvailable: lottery.totalSlots, // Assuming all slots are available initially
      whyCollect: lottery.whyCollect || [],
      parts: lottery.parts || [],
    };
  };

  const set = transformLotteryData(lotteryData?.lottery);

  if (isLoading) {
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

  if (error || !set) {
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
            <p className="text-muted-foreground leading-relaxed">
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
          />
        </div>
      </div>

      {/* Parts Section */}
      <div className="mt-10 pt-5 border-t">
        <h2 className="text-2xl font-bold mb-5">{set.name} Parts</h2>
        {set.parts && set.parts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {set.parts.map((part) => (
              <PartItemCard key={part._id} part={part} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No parts available for this lottery yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryDetails;
