import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PartItemCard from "@/components/home/components/PartItemCard";
import SearchSortPaginationWrapper from "@/components/shared/SearchSortPaginationWrapper";

const PriorityListDialog = ({
  open,
  onClose,
  // Data props
  selectedParts,
  availableParts,
  totalPages,
  currentPage,
  startEntry,
  endEntry,
  // Handler props
  handleAddPart,
  handleRemovePart,
  handleSave,
  handleSelectAll,
  handleClearAll,
  // Loading states
  saving,
  selectAllLoading,
  isLoading,
  // Data from API
  data,
  // Callback for when params change
  onParamsChange,
  // Select all mode state
  isSelectAllMode = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl w-full">
        <DialogHeader className="mb-3">
          <DialogTitle>Set Your Priority List</DialogTitle>
          <DialogDescription>
            Choose the parts you want most during the draft
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Available Parts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <CardTitle>Available Parts</CardTitle>
                <Badge variant="secondary" className="ml-auto">
                  {data?.totalAllParts ?? 0}{" "}
                  {data?.totalAllParts === 1 ? "Unique Part" : "Unique Parts"}
                </Badge>
              </div>

              <CardContent className="p-0">
                {/* Search, Sort, and Filter Controls */}
                <SearchSortPaginationWrapper
                  categoryOptions={data?.availableCategories || []}
                  colorOptions={data?.availableColors || []}
                  totalItems={data?.totalParts || 0}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  startEntry={startEntry}
                  endEntry={endEntry}
                  showPerPage={false}
                  showPagination={
                    totalPages > 1 &&
                    availableParts.length > 0 &&
                    !selectAllLoading &&
                    !isSelectAllMode
                  }
                  compact={true}
                  isLoading={isLoading}
                  onParamsChange={onParamsChange}
                >
                  {/* Select All and Clear All Buttons */}
                  <div className="flex gap-2 mb-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={handleSelectAll}
                      disabled={
                        selectAllLoading ||
                        !data?.totalAllParts ||
                        availableParts.length === 0
                      }
                    >
                      {selectAllLoading ? "Selecting..." : "Select All"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={handleClearAll}
                      disabled={selectedParts.length === 0}
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Available Parts List */}
                  <div className="flex-1 max-h-[535px] overflow-y-auto space-y-1">
                    {isLoading ? (
                      [...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className="animate-pulse h-16 bg-muted rounded"
                        />
                      ))
                    ) : availableParts.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        {selectedParts.length > 0
                          ? "All parts have been added to your priority list."
                          : "No available parts found."}
                      </div>
                    ) : (
                      availableParts.map((part, index) => (
                        <div
                          key={`${part._id}-${index}`}
                          className="relative cursor-pointer flex items-center"
                          onClick={() => handleAddPart(part)}
                        >
                          <div className="flex-1 min-w-0">
                            <PartItemCard part={part} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </SearchSortPaginationWrapper>
              </CardContent>
            </CardHeader>
          </Card>

          {/* Right Column - Selected Parts */}
          <Card className="sticky top-0 max-h-[620px] overflow-y-auto">
            <CardHeader className="flex items-center gap-2">
              <CardTitle>Your Priority List</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {selectedParts.length} selected
              </Badge>
            </CardHeader>

            <CardContent className="space-y-1">
              {selectedParts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No parts in your priority list.
                </div>
              ) : (
                selectedParts.map((p, index) => (
                  <div
                    key={`${p.item._id || p.item}-${index}`}
                    className="relative flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <PartItemCard part={p.item} />
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleRemovePart(p.item._id || p.item)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Priority List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriorityListDialog;
