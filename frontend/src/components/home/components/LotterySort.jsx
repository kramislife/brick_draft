import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOTTERY_SORT_OPTIONS } from "@/constant/sortOption";

const LotterySort = ({ sortBy, onSortChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm hidden sm:block">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {LOTTERY_SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LotterySort;
