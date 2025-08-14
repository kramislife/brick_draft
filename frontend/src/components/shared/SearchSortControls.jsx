import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PER_PAGE_OPTIONS } from "@/constant/sortOption";

const SearchSortControls = ({
  // Search props
  search,
  onSearchChange,
  searchPlaceholder = "Search by Name, Category, Color, Part ID, Item ID...",

  // Sort props
  sort,
  onSortChange,
  sortOptions = [],

  // Category filter props
  category,
  onCategoryChange,
  categoryOptions = [],

  // Color filter props
  color,
  onColorChange,
  colorOptions = [],

  // Per page props
  perPage,
  onPerPageChange,
  perPageOptions = PER_PAGE_OPTIONS,

  // Display props
  showPerPage = true,
  compact = false,
}) => {
  return (
    <div
      className={`grid gap-3 ${
        compact
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-6"
      }`}
    >
      {/* Search */}
      <div
        className={`${
          compact
            ? "md:col-span-2 lg:col-span-3"
            : "md:col-span-2 lg:col-span-2"
        }`}
      >
        <Label className="text-sm mb-1">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={onSearchChange}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Sort By Filter */}
      {sortOptions.length > 0 && (
        <div className="w-full">
          <Label className="text-sm mb-1">Sort By</Label>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Category Filter */}
      <div className="w-full">
        <Label className="text-sm mb-1">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {categoryOptions.map((cat, index) => (
              <SelectItem key={`${cat}-${index}`} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color Filter */}
      <div className="w-full">
        <Label className="text-sm mb-1">Color</Label>
        <Select value={color} onValueChange={onColorChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Colors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {colorOptions.map((col, index) => (
              <SelectItem key={`${col.id}-${index}`} value={col.id}>
                <span className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: col.hex }}
                  />
                  {col.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Per Page Filter */}
      {showPerPage && (
        <div className="w-full">
          <Label className="text-sm mb-1">Per Page</Label>
          <Select value={perPage.toString()} onValueChange={onPerPageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="20" />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default SearchSortControls;
