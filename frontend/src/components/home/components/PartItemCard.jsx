import React from "react";
import { Box, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PartItemCard = ({ part }) => {
  const displayId = part.part_id || part.item_id || "No ID";
  const colorName = part.color?.color_name || part.color || "No Color";
  const partImage =
    part.item_image?.url ||
    part.item_image?.[0] ||
    part.image ||
    "/placeholder-part.jpg";

  return (
    <Card className="p-0 rounded border-2 hover:border-blue-300 cursor-pointer transition-all duration-300">
      <CardContent className="flex flex-row items-start gap-2 py-1 px-1">
        <div className="flex-shrink-0 rounded bg-muted-foreground/10 p-0.5 flex items-center justify-center transition-all duration-300 w-23 h-23">
          {partImage && partImage !== "/placeholder-part.jpg" ? (
            <img
              src={partImage}
              alt={part.name}
              className="object-cover aspect-square rounded transition-all duration-300 w-full h-full"
              onError={(e) => {
                e.target.src = "/placeholder-part.jpg";
              }}
            />
          ) : (
            <Box className="text-muted-foreground mx-auto transition-all duration-300 w-10 h-10" />
          )}
        </div>

        <div className="flex flex-col pt-1 pb-1">
          <h4 className="text-lg font-semibold line-clamp-1">
            <span>{displayId}</span>
            <span className="mx-1">•</span>
            {part.name || "Part Name"}
          </h4>

          <div className="flex flex-wrap gap-2 font-semibold text-lg">
            <span className="flex items-center gap-1">
              <span>Quantity:</span>
              {part.quantity || "0"}
            </span>
            <span className="flex items-center gap-1">
              <span>Total Value:</span>
              <span className="text-emerald-500 font-semibold">
                ${Number(part.total_value || part.totalValue || 0).toFixed(2)}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-semibold text-lg">
            <span className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              {colorName}
            </span>
            <span className="flex items-center gap-1">
              <Box className="w-4 h-4" />
              {part.category_name ||
                part.category ||
                part.partType ||
                "Unknown"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartItemCard;
