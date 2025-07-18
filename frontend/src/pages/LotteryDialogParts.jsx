import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PartItemCard from "@/components/home/components/PartItemCard";

const LotteryDialogParts = ({ parts, setName, drawDate }) => {
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

  // Separate parts by category
  const partsByCategory = parts.reduce((acc, part) => {
    const category = part.category_name || part.category || "part";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(part);
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
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-start text-xl font-bold ">
          {setName} Parts
        </DialogTitle>
        <DialogDescription className="sr-only">
          This is a list of all the parts that are included in the lottery set.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        {Object.entries(partsByCategory).map(([category, categoryParts]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-lg font-semibold">
              {getCategoryDisplayName(category)}
            </h3>
            <div className="space-y-1">
              {categoryParts.map((part) => (
                <PartItemCard key={part._id} part={part} drawDate={drawDate} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  );
};

export default LotteryDialogParts;
