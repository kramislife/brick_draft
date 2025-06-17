import React from "react";
import { Scale, Box, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PartItemCard = ({ part }) => {
  return (
    <Card className="p-0">
      <CardContent className="flex flex-col sm:flex-row items-start gap-3 p-3">
        <div className="w-full sm:w-20 h-auto sm:h-20 flex-shrink-0 bg-white border rounded-md p-0.5">
          <img
            src={part.image}
            alt={part.name}
            className="w-full h-full object-contain aspect-square"
          />
        </div>

        <div className="flex flex-col gap-3 sm:gap-1">
          <h4 className="text-lg font-semibold line-clamp-1">
            <span>Part ID: {part.id}</span>
            <span className="mx-1">•</span>
            {part.name}
          </h4>

          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1">
              <span>Quantity:</span>
              {part.quantity}
            </span>
            <span className="flex items-center gap-1">
              <span>Total Value:</span>
              <span className="text-emerald-500 font-semibold">
                ${part.price}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              {part.color}
            </span>
            <span className="flex items-center gap-1">
              <Box className="w-4 h-4" />
              {part.partType}
            </span>
            <span className="flex items-center gap-1">
              <Scale className="w-4 h-4" />
              {part.weight}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartItemCard;
