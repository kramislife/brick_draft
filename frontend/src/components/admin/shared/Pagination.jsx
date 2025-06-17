import { Button } from "@/components/ui/button";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalEntries,
  startEntry,
  endEntry,
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-sm text-muted-foreground">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
