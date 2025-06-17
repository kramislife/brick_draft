import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PartItemCard from "@/components/home/components/PartItemCard";

const LotteryDialogParts = ({ parts, setName, PARTS }) => {
  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-start font-['Bangers'] text-2xl tracking-widest">
          {setName} Parts
        </DialogTitle>
      </DialogHeader>

      {Object.entries(parts).map(([key, partArray]) => (
        <div key={key} className="space-y-2">
          <h3 className="text-lg font-semibold">{PARTS[key.toUpperCase()]}</h3>
          <div className="space-y-3">
            {partArray.map((part) => (
              <PartItemCard key={part.id} part={part} />
            ))}
          </div>
        </div>
      ))}
    </DialogContent>
  );
};

export default LotteryDialogParts;
