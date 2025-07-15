import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Package, ImageIcon } from "lucide-react";

const LotteryDetailsCard = ({ lottery }) => {
  if (!lottery) return null;

  const details = [
    {
      icon: Calendar,
      label: "Draw Date",
      value: lottery?.formattedDrawDate || "TBD",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      iconBg: "bg-blue-200 dark:bg-blue-900/40",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Clock,
      label: "Draw Time",
      value: lottery?.formattedDrawTime || "TBD",
      bg: "bg-purple-100 dark:bg-purple-900/20",
      iconBg: "bg-purple-200 dark:bg-purple-900/40",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Package,
      label: "Total Pieces",
      value: lottery?.pieces?.toLocaleString() || "-",
      bg: "bg-emerald-100 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-200 dark:bg-emerald-900/40",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <Card className="p-0">
      <div className="relative">
        <div className="aspect-video border-b">
          {lottery?.image?.url ? (
            <img
              src={lottery.image.url}
              alt={lottery?.title || "Lottery Set"}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <div className="mb-5">
            <h2 className="text-2xl font-bold mb-2">{lottery?.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {lottery?.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {details.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg ${detail.bg}`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${detail.iconBg}`}
                  >
                    <Icon className={`w-5 h-5 ${detail.textColor}`} />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-medium uppercase tracking-wide ${detail.textColor}`}
                    >
                      {detail.label}
                    </div>
                    <div className="font-semibold">{detail.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default LotteryDetailsCard;
