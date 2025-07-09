import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Package } from "lucide-react";
import LotteryImageSection from "@/components/lottery-details/LotteryImageSection";
import LotteryWhyCollect from "@/components/lottery-details/LotteryWhyCollect";
import LotteryStatsCards from "@/components/lottery-details/LotteryStatsCards";
import LotteryPurchaseSection from "@/components/lottery-details/LotteryPurchaseSection";
import { paymentMethod } from "@/constant/paymentMethod";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import LotteryPartsSection from "@/components/lottery-details/LotteryPartsSection";
import {
  useGetPublicLotteryByIdQuery,
  useGetLotteryPartsByIdQuery,
} from "@/redux/api/publicApi";

const SORT_OPTIONS = [
  { value: "name", label: "Name: A-Z" },
  { value: "-name", label: "Name: Z-A" },
  { value: "part_id", label: "Part ID: Low to High" },
  { value: "-part_id", label: "Part ID: High to Low" },
  { value: "quantity", label: "Quantity: Low to High" },
  { value: "-quantity", label: "Quantity: High to Low" },
  { value: "total_value", label: "Total Value: Low to High" },
  { value: "-total_value", label: "Total Value: High to Low" },
  { value: "date", label: "Date: Oldest to Newest" },
  { value: "-date", label: "Date: Newest to Oldest" },
];
const PER_PAGE_OPTIONS = [10, 25, 50, 100, "all"];

const LotteryDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // PARTS STATE
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [category, setCategory] = useState("all");
  const [color, setColor] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Fetch lottery details
  const {
    data: lotteryData,
    isLoading: isLotteryLoading,
    error: lotteryError,
  } = useGetPublicLotteryByIdQuery(id);

  // Fetch parts data from backend with all logic handled server-side
  const {
    data: partsData,
    isLoading: isPartsLoading,
    error: partsError,
  } = useGetLotteryPartsByIdQuery(
    {
      id,
      params: {
        search,
        sort,
        color: color === "all" ? undefined : color,
        category: category === "all" ? undefined : category,
        page,
        limit: perPage === "all" ? undefined : perPage,
      },
    },
    {
      // Skip the query if we don't have the lottery ID yet
      skip: !id,
    }
  );

  // Extract parts data from backend response
  const parts = partsData?.parts || [];
  const totalParts = partsData?.totalParts || 0;
  const totalPages = partsData?.totalPages || 1;
  const currentPage = partsData?.page || 1;

  // Calculate pagination display values
  const startEntry =
    totalParts === 0
      ? 0
      : (currentPage - 1) * (perPage === "all" ? totalParts : perPage) + 1;
  const endEntry =
    perPage === "all"
      ? totalParts
      : Math.min(
          startEntry + (perPage === "all" ? totalParts : perPage) - 1,
          totalParts
        );

  // Get all parts for the current lottery
  const allParts = useMemo(
    () => lotteryData?.lottery?.parts || [],
    [lotteryData]
  );

  // Filtered parts based on current selection
  const filteredParts = useMemo(() => {
    return allParts.filter((p) => {
      const matchesCategory =
        category === "all" || p.part?.category_name === category;
      const matchesColor =
        color === "all" ||
        (p.part?.color &&
          (p.part.color._id === color || p.part.color === color));
      return matchesCategory && matchesColor;
    });
  }, [allParts, category, color]);

  // Category options: only those present in filtered parts
  const categoryOptions = useMemo(() => {
    const cats = Array.from(
      new Set(filteredParts.map((p) => p.part?.category_name).filter(Boolean))
    );
    return cats;
  }, [filteredParts]);

  // Color options: only those present in filtered parts
  const colorOptions = useMemo(() => {
    const colors = filteredParts
      .map((p) => p.part?.color)
      .filter(Boolean)
      .map((c) =>
        typeof c === "object"
          ? { id: c._id, name: c.color_name, hex: c.hex_code }
          : null
      )
      .filter(Boolean);
    // Remove duplicates
    const unique = [];
    colors.forEach((c) => {
      if (!unique.some((u) => u.id === c.id)) unique.push(c);
    });
    return unique;
  }, [filteredParts]);

  // Pagination numbers (show up to 3 around current)
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);
    if (currentPage > 4) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  // Handlers
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };
  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };
  const handleColorChange = (value) => {
    setColor(value);
    setPage(1);
  };
  const handlePerPageChange = (value) => {
    setPerPage(value === "all" ? "all" : Number(value));
    setPage(1);
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Format draw date/time
  const formatDrawDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "TBD";
    }
  };
  const formatDrawTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return (
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }) + " EST"
      );
    } catch {
      return "";
    }
  };

  // Transform lottery data
  const set = useMemo(() => {
    if (!lotteryData?.lottery) return null;
    const lottery = lotteryData.lottery;
    return {
      id: lottery._id,
      name: lottery.title,
      description: lottery.description,
      image: lottery.image?.url || "",
      theme: lottery.collection?.name || "Unknown",
      features: lottery.tag
        ? [
            lottery.tag
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          ]
        : [],
      price: lottery.ticketPrice,
      marketPrice: lottery.marketPrice,
      pieces: lottery.pieces,
      drawDate: formatDrawDate(lottery.drawDate),
      drawTime: formatDrawTime(lottery.drawTime),
      totalSlots: lottery.totalSlots,
      slotsAvailable: lottery.totalSlots, // Assuming all slots are available initially
      whyCollect: lottery.whyCollect || [],
      parts: lottery.parts || [],
    };
  }, [lotteryData]);

  if (isLotteryLoading) {
    return (
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-[600px] rounded-xl"></div>
          </div>
          <div className="space-y-5">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-8 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
            <div className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-24 rounded"></div>
                ))}
              </div>
            </div>
            <div className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (lotteryError || !set) {
    return (
      <div className="p-5">
        <FallbackStates
          icon={Package}
          title="Lottery Not Found"
          description="The lottery you're looking for doesn't exist or has been removed."
          className="min-h-[500px]"
        />
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Image Section */}
        <div className="lg:sticky lg:top-23 lg:h-fit self-start">
          <LotteryImageSection set={set} />
        </div>

        {/* Details Section */}
        <div className="space-y-5 font-[Inter]">
          <div className="space-y-2">
            <h1 className="hidden lg:block text-4xl font-bold">{set.name}</h1>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {set.description}
            </p>
          </div>

          <LotteryWhyCollect set={set} />
          <LotteryStatsCards set={set} />
          <LotteryPurchaseSection
            set={set}
            quantity={quantity}
            setQuantity={setQuantity}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>

      {/* Parts Section */}
      <LotteryPartsSection
        partsTitle={set.name + " Parts"}
        search={search}
        sort={sort}
        category={category}
        color={color}
        perPage={perPage}
        page={page}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onCategoryChange={handleCategoryChange}
        onColorChange={handleColorChange}
        onPerPageChange={handlePerPageChange}
        onPageChange={handlePageChange}
        categoryOptions={categoryOptions}
        colorOptions={colorOptions}
        sortOptions={SORT_OPTIONS}
        perPageOptions={PER_PAGE_OPTIONS}
        paginatedParts={parts}
        totalParts={totalParts}
        startEntry={startEntry}
        endEntry={endEntry}
        totalPages={totalPages}
        currentPage={currentPage}
        getPageNumbers={getPageNumbers}
        isLoading={isPartsLoading}
      />
    </div>
  );
};

export default LotteryDetails;
