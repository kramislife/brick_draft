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
  useGetLotteryByIdQuery,
  useGetLotteryPartsByIdQuery,
} from "@/redux/api/lotteryApi";
import { PART_SORT_OPTIONS, PER_PAGE_OPTIONS } from "@/constant/sortOption";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/authSlice";

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
  } = useGetLotteryByIdQuery(id);

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

  //  context-aware filter options
  const categoryOptions = partsData?.availableCategories || [];
  const colorOptions = partsData?.availableColors || [];

  // Pagination numbers (show up to 3 around current)
  const getPageNumbers = () => {
    if (totalPages <= 1) {
      return [];
    }
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
    if (totalPages > 1) {
      pages.push(totalPages);
    }
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
      features: lottery.formattedTag || [],
      price: lottery.ticketPrice,
      marketPrice: lottery.marketPrice,
      pieces: lottery.pieces,
      drawDate: lottery.formattedDrawDate || "TBD",
      drawTime: lottery.formattedDrawTime || "",
      totalSlots: lottery.totalSlots,
      slotsAvailable: lottery.slotsAvailable,
      whyCollect: lottery.whyCollect || [],
      parts: lottery.parts || [],
    };
  }, [lotteryData]);

  const user = useSelector(selectCurrentUser);

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
            userEmail={user?.email}
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
        sortOptions={PART_SORT_OPTIONS}
        perPageOptions={PER_PAGE_OPTIONS}
        paginatedParts={parts}
        totalParts={totalParts}
        startEntry={startEntry}
        endEntry={endEntry}
        totalPages={totalPages}
        currentPage={currentPage}
        getPageNumbers={getPageNumbers}
        isLoading={isPartsLoading}
        drawDate={set.drawDate}
      />
    </div>
  );
};

export default LotteryDetails;
