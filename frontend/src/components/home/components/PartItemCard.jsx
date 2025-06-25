import React from "react";
import { Scale, Box, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PartItemCard = ({ part }) => {
  // Determine which ID to display based on API data structure
  const displayId =
    part.part_id && part.item_id
      ? `Part ID: ${part.part_id} • Item ID: ${part.item_id}`
      : part.part_id
      ? `Part ID: ${part.part_id}`
      : part.item_id
      ? `Item ID: ${part.item_id}`
      : `ID: ${part._id}`;

  // Get color name from the color object or use direct color string
  const colorName = part.color?.color_name || part.color || "Unknown";

  // Get image from item_images array or use direct image
  const partImage =
    part.item_images?.[0]?.url ||
    part.item_images?.[0] ||
    part.image ||
    "/placeholder-part.jpg";

  // Format weight with "g" unit
  const formattedWeight = part.weight ? `${part.weight}g` : "N/A";

  return (
    <Card className="p-0">
      <CardContent className="flex flex-col sm:flex-row items-start gap-3 p-3">
        <div className="w-full sm:w-22 h-auto sm:h-22 flex-shrink-0">
          <img
            src={partImage}
            alt={part.name}
            className="w-full h-full object-cover aspect-square"
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

          <div className="flex flex-wrap gap-2 font-semibold">
            <span className="flex items-center gap-1">
              <span>Quantity:</span>
              {part.quantity}
            </span>
            <span className="flex items-center gap-1">
              <span>Total Value:</span>
              <span className="text-emerald-500 font-semibold">
                ${Number(part.total_value || part.totalValue || 0).toFixed(2)}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
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
            <span className="flex items-center gap-1">
              <Scale className="w-4 h-4" />
              {formattedWeight}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartItemCard;
