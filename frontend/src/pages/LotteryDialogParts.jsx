import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PartItemCard from "@/components/home/components/PartItemCard";

const LotteryDialogParts = ({ parts, setName }) => {
  // If no parts data, show a message
  if (!parts || parts.length === 0) {
    return (
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-start text-2xl font-bold">
            {setName} Parts
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-8 text-muted-foreground">
          <p>No parts information available for this lottery set.</p>
        </div>
      </DialogContent>
    );
  }

  // Transform part data to match the expected format
  const transformPartData = (part) => ({
    id: part.part_id || part.item_id || part._id || part.id || "Unknown",
    partId: part.part_id || "Unknown",
    itemId: part.item_id || "Unknown",
    name: part.name || "Unknown Part",
    image: part.item_images?.[0]?.url || part.image || "",
    quantity: part.quantity || 1,
    price: part.price || 0,
    totalValue: part.total_value || part.price * part.quantity || 0,
    color: part.color?.color_name || part.color || "Unknown",
    partType: part.category_name || part.category || "Unknown",
    weight: part.weight ? `${part.weight}g` : "Unknown",
  });

  // Separate parts by category
  const partsByCategory = parts.reduce((acc, part) => {
    const category = part.category || "part";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transformPartData(part));
    return acc;
  }, {});

  // Get category display names
  const getCategoryDisplayName = (category) => {
    switch (category) {
      case "part":
        return "Parts";
      case "minifigure":
        return "Minifigures";
      default:
        return "Parts";
    }
  };

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-start text-2xl font-bold">
          {setName} Parts
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5">
        {Object.entries(partsByCategory).map(([category, categoryParts]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-lg font-semibold">
              {getCategoryDisplayName(category)}
            </h3>
            <div className="space-y-3">
              {categoryParts.map((part) => (
                <PartItemCard key={part.id} part={part} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  );
};

export default LotteryDialogParts;
