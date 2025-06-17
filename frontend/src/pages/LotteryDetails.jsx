import React, { useState } from "react";
import { useParams } from "react-router-dom";
import LotteryImageSection from "@/components/lottery-details/LotteryImageSection";
import LotteryWhyCollect from "@/components/lottery-details/LotteryWhyCollect";
import LotteryStatsCards from "@/components/lottery-details/LotteryStatsCards";
import LotteryPurchaseSection from "@/components/lottery-details/LotteryPurchaseSection";
import { paymentMethod } from "@/constant/paymentMethod";
import { lotteryData } from "@/constant/data";
import PartItemCard from "@/components/home/components/PartItemCard";

const LotteryDetails = () => {
  const { id } = useParams();
  const set = lotteryData.find((item) => item.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!set) return <div>Set not found</div>;

  // Get all parts across all categories
  const allParts = Object.values(set.parts).flat();

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
        <h2 className="text-2xl font-bold mb-6">Genuine Parts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allParts.map((part) => (
            <PartItemCard key={part.id} part={part} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LotteryDetails;
