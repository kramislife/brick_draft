import React from "react";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PartItemCard from "@/components/home/components/PartItemCard";

const LotteryPartsSection = ({
  search,
  sort,
  category,
  color,
  perPage,
  page,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  onColorChange,
  onPerPageChange,
  onPageChange,
  categoryOptions,
  colorOptions,
  sortOptions,
  perPageOptions,
  paginatedParts,
  totalParts,
  startEntry,
  endEntry,
  totalPages,
  currentPage,
  getPageNumbers,
  partsTitle,
  isLoading = false,
}) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-5">{partsTitle}</h2>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-1 items-end mb-6">
        <div className="flex flex-col">
          <Label className="text-sm mb-1 font-semibold">Search Parts</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Name, Category, Color, Part ID, Item ID..."
              value={search}
              onChange={onSearchChange}
              className="pl-10 min-w-[450px]"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm mb-1 font-semibold">Sort By</Label>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="min-w-[300px]">
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
        <div className="flex flex-col">
          <Label className="text-sm mb-1 font-semibold">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="min-w-[300px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm mb-1 font-semibold">Color</Label>
          <Select value={color} onValueChange={onColorChange}>
            <SelectTrigger className="min-w-[300px]">
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {colorOptions.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  <span className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: col.hex }}
                    />
                    {col.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm mb-1 font-semibold">Per Page</Label>
          <Select value={perPage.toString()} onValueChange={onPerPageChange}>
            <SelectTrigger className="min-w-[120px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((opt) => (
                <SelectItem key={opt} value={opt.toString()}>
                  {opt === "all" ? "All" : opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Parts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : paginatedParts && paginatedParts.length > 0 ? (
        <div className="grid grid-cols-1 gap-1">
          {paginatedParts.map((part) => (
            <PartItemCard key={part._id} part={part} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No parts available for this lottery yet.</p>
        </div>
      )}

      {/* Pagination and Results Count */}
      {perPage !== "all" && totalPages > 1 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-3">
          <div className="text-sm text-muted-foreground">
            Showing {startEntry} to {endEntry} of {totalParts} parts
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              &lt;
            </Button>
            {getPageNumbers().map((num, idx) =>
              num === "..." ? (
                <span key={idx} className="px-2 text-lg text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={num}
                  variant={num === currentPage ? "accent" : "outline"}
                  size="icon"
                  onClick={() => onPageChange(num)}
                  className={`rounded-full font-bold transition-colors ${
                    num === currentPage
                      ? "bg-accent text-white"
                      : "hover:bg-accent/20"
                  }`}
                >
                  {num}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              &gt;
            </Button>
          </div>
        </div>
      )}
      {perPage === "all" && (
        <div className="text-sm text-muted-foreground mt-6">
          Showing {totalParts === 0 ? 0 : 1} to {totalParts} of {totalParts}{" "}
          parts
        </div>
      )}
    </div>
  );
};

export default LotteryPartsSection;
