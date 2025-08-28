import React from "react";
import { Badge } from "@/components/ui/badge";

const LotteryImageSection = ({ image, name, theme, features }) => {
  return (
    <div className="relative rounded-xl overflow-hidden h-full md:h-[600px] border dark:border-none">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 p-1"
      />
      <div className="absolute top-4 left-4">
        <Badge className="text-sm">{theme}</Badge>
      </div>
      <div className="absolute top-4 right-4">
        {features.map((feature) => (
          <Badge key={feature} variant="accent" className="text-sm">
            {feature}
          </Badge>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="absolute bottom-5 left-5">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            {name}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default LotteryImageSection;
