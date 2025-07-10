import React from "react";
import { Box, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Helper to check if drawDate is within 1 day from now
const isWithinOneDay = (drawDate) => {
  if (!drawDate || drawDate === "TBD") return false;
  const now = new Date();
  const draw = new Date(drawDate);
  // If drawDate is a string like 'June 10, 2024', parse as local date
  if (isNaN(draw.getTime())) {
    // Try parsing as 'MMMM d, yyyy' (e.g., 'June 10, 2024')
    const parsed = Date.parse(drawDate);
    if (!isNaN(parsed)) {
      draw.setTime(parsed);
    } else {
      return false;
    }
  }
  // Calculate difference in days
  const diff = (draw - now) / (1000 * 60 * 60 * 24);
  return diff <= 1 && diff >= 0;
};

const PartItemCard = ({ part, drawDate }) => {
  const displayId = part.part_id;
  const colorName = part.color?.color_name || part.color || "Unknown";
  const partImage =
    part.item_image?.url ||
    part.item_image?.[0] ||
    part.image ||
    "/placeholder-part.jpg";

  // Only show quantity/total_value if within 1 day of drawDate
  const showQtyValue = isWithinOneDay(drawDate);

  return (
    <Card className="p-0 rounded">
      <CardContent className="flex flex-row items-start gap-2 py-1 px-1">
        <div
          className={`flex-shrink-0 rounded bg-muted-foreground/10 p-0.5 flex items-center justify-center transition-all duration-300
    ${showQtyValue ? "w-23 h-23" : "w-16 h-16"}`}
        >
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
            <Box
              className={`text-muted-foreground mx-auto transition-all duration-300 ${
                showQtyValue ? "w-10 h-10" : "w-8 h-8"
              }`}
            />
          )}
        </div>

        <div className="flex flex-col pt-1 pb-1">
          <h4 className="text-lg font-semibold line-clamp-1">
            <span>{displayId || "Part ID"}</span>
            <span className="mx-1">•</span>
            {part.name || "Part Name"}
          </h4>

          {showQtyValue && (
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
          )}

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
