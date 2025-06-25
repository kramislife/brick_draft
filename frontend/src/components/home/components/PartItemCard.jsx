import React from "react";
import { Scale, Box, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PartItemCard = ({ part }) => {
  // Determine which ID to display
  const displayId =
    part.partId && part.itemId
      ? `Part ID: ${part.partId} • Item ID: ${part.itemId}`
      : `ID: ${part.id}`;

  return (
    <Card className="p-0">
      <CardContent className="flex flex-col sm:flex-row items-start gap-3 p-3">
        <div className="w-full sm:w-20 h-auto sm:h-20 flex-shrink-0">
          <img
            src={part.image || "/placeholder-part.jpg"}
            alt={part.name}
            className="w-full h-full object-cover aspect-square rounded border"
            onError={(e) => {
              e.target.src = "/placeholder-part.jpg";
            }}
          />
        </div>

        <div className="flex flex-col gap-3 sm:gap-1">
          <h4 className="text-lg font-semibold line-clamp-1">
            <span>{displayId}</span>
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
                ${Number(part.totalValue).toFixed(2)}
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
