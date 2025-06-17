import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/admin/shared/SearchBar";
import ShowEntries from "@/components/admin/shared/ShowEntries";
import TableLayout from "@/components/admin/shared/TableLayout";
import Pagination from "@/components/admin/shared/Pagination";

const ViewLayout = ({ title, description, onAdd, columns, data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(() => {
    return localStorage.getItem(`${title.toLowerCase()}_entries`) || "10";
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem(`${title.toLowerCase()}_entries`, entriesPerPage);
  }, [entriesPerPage, title]);

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate pagination
  const totalEntries = filteredData.length;
  const numberOfEntries =
    entriesPerPage === totalEntries.toString()
      ? totalEntries
      : Number(entriesPerPage);

  const totalPages = Math.ceil(totalEntries / numberOfEntries);

  // Reset to first page when entries per page changes
  const handleEntriesChange = (value) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  // Get paginated data
  const paginatedData =
    entriesPerPage === totalEntries.toString()
      ? filteredData
      : filteredData.slice(
          (currentPage - 1) * numberOfEntries,
          currentPage * numberOfEntries
        );

  // Display entries
  const startEntry = (currentPage - 1) * numberOfEntries + 1;
  const endEntry = Math.min(
    startEntry + paginatedData.length - 1,
    totalEntries
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <Button onClick={onAdd} variant="accent">
          <Plus />
          New {title}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <ShowEntries
            value={entriesPerPage}
            onChange={handleEntriesChange}
            totalEntries={totalEntries}
          />
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${title}`}
          />
        </div>

        <TableLayout columns={columns} data={paginatedData} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalEntries={totalEntries}
          startEntry={startEntry}
          endEntry={endEntry}
        />
      </div>
    </div>
  );
};

export default ViewLayout;
