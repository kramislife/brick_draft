import React from "react";
import { Button } from "@/components/ui/button";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  startEntry,
  endEntry,
  totalItems,
  showPagination = true,
}) => {
  if (!showPagination || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-center gap-3">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        <span className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>

        <span className="text-xs text-muted-foreground">
          | Showing {startEntry} to {endEntry} of {totalItems} parts
        </span>

        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
