import React from "react";
import { Box, Sparkles, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LotteryStatsCards = ({ set }) => {
  const statsCards = [
    {
      id: "market-price",
      icon: Box,
      title: "Market Price",
      value: `$${set.marketPrice}`,
      subtitle: "Retail value",
      color: "emerald",
      textColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      id: "draw-date",
      icon: Calendar,
      title: "Draw Date",
      value: set.drawDate,
      subtitle: set.drawTime,
      color: "blue",
      textColor: "text-blue-700 dark:text-blue-400/70",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "pieces",
      icon: Sparkles,
      title: "Pieces",
      value: set.pieces,
      subtitle: "Complete set",
      color: "amber",
      textColor: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {statsCards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.id}
            className="overflow-hidden shadow-md dark:border-none"
          >
            <CardContent className="relative px-5">
              <div
                className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 ${card.bgColor} rounded-full`}
              ></div>
              <Icon className={`w-6 h-6 ${card.textColor} mb-2`} />
              <div className="text-muted-foreground font-medium">
                {card.title}
              </div>
              <div className={`text-3xl font-bold mt-2 ${card.textColor}`}>
                {card.value}
              </div>
              <div className={`text-xs ${card.textColor} mt-2`}>
                {card.subtitle}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LotteryStatsCards;
