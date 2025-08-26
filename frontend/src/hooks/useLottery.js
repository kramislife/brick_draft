import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetLotteriesQuery,
  useGetLotteryPartsByIdQuery,
  useGetLotteryByIdQuery,
} from "@/redux/api/lotteryApi";
import { useCreateCheckoutSessionMutation } from "@/redux/api/paymentApi";
import { selectCurrentUser } from "@/redux/features/authSlice";
import { toast } from "sonner";

// --------------------------------------- Utility Functions ----------------------------------------

// Transform lottery data for display
const transformLotteryData = (lottery) => ({
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
  lottery_status: lottery.lottery_status,
});

// Create event handlers factory
const createEventHandlers = (navigate) => ({
  handleNavigateToLottery: (lotteryId) => navigate(`/lottery/${lotteryId}`),
  handleViewPartsClick: (e) => e.stopPropagation(),
});

// Extract parts data from API response
const extractPartsData = (partsData) => ({
  parts: partsData?.parts || [],
  totalParts: partsData?.totalParts || 0,
  totalPages: partsData?.totalPages || 1,
  currentPage: partsData?.page || 1,
  startEntry: partsData?.startEntry || 1,
  endEntry: partsData?.endEntry || partsData?.totalParts || 0,
  categoryOptions: partsData?.availableCategories || [],
  colorOptions: partsData?.availableColors || [],
});

// Base hook for lottery parts queries
const useLotteryPartsQuery = (lotteryId, params) => {
  return useGetLotteryPartsByIdQuery(
    {
      id: lotteryId,
      params,
    },
    {
      skip: !lotteryId,
    }
  );
};

// --------------------------------------- Lottery Grid ----------------------------------------
export const useLottery = ({ title, showViewAll = false, limit }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("created_at");

  // Fetch lottery data
  const {
    data: lotteriesData,
    isLoading,
    error,
  } = useGetLotteriesQuery({ sortBy });

  const lotteries = lotteriesData?.lotteries || [];

  // Only include upcoming lotteries
  const upcomingLotteries = lotteries.filter(
    (lottery) => lottery.lottery_status === "upcoming"
  );

  // Transform lottery data for display
  const transformedLotteries = upcomingLotteries.map(transformLotteryData);

  // Apply limit from LotterySet.jsx
  const limitedData = limit
    ? transformedLotteries.slice(0, limit)
    : transformedLotteries;

  const hasMoreSets = limit && transformedLotteries.length > limit;
  const hasNoData = !isLoading && limitedData.length === 0;

  // Event handlers
  const eventHandlers = createEventHandlers(navigate);
  const handleSortChange = (newSortBy) => setSortBy(newSortBy);

  // Computed values for LotteryCard
  const getLotteryCardProps = (set) => {
    return {
      // Basic data
      id: set.id,
      name: set.name,
      image: set.image || "/placeholder-image.jpg",
      theme: set.theme,
      features: set.features,
      pieces: set.pieces,
      price: Number(set.price).toFixed(2),
      drawDate: set.drawDate,
      drawTime: set.drawTime,
      totalSlots: set.totalSlots,
      slotsAvailable: set.slotsAvailable,

      // Event handlers
      onCardClick: () => eventHandlers.handleNavigateToLottery(set.id),
      onViewPartsClick: eventHandlers.handleViewPartsClick,
    };
  };

  // Computed values for child components
  const lotterySortProps = {
    sortBy,
    onSortChange: handleSortChange,
  };

  const viewAllButtonProps = {
    show: showViewAll && hasMoreSets,
    href: "/lottery/all",
  };

  return {
    // State
    isLoading,
    error,
    hasNoData,

    // Data
    limitedData,
    title,

    // Event handlers
    handleSortChange,

    // Computed props for child components
    getLotteryCardProps,
    lotterySortProps,
    viewAllButtonProps,
  };
};

// --------------------------------------- Lottery Details ----------------------------------------
export const useLotteryDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const user = useSelector(selectCurrentUser);

  // Fetch lottery details
  const { data: lotteryData, isLoading: isLotteryLoading } =
    useGetLotteryByIdQuery(id, {
      skip: !id,
    });

  // Transform lottery data
  const set = lotteryData?.lottery
    ? transformLotteryData(lotteryData.lottery)
    : null;

  // Computed values
  const hasNoData = !isLotteryLoading && (!lotteryData?.lottery || !set);

  // Event handlers
  const handleQuantityChange = (newQuantity) => setQuantity(newQuantity);

  return {
    // State
    isLotteryLoading,
    hasNoData,
    quantity,

    // Data
    set,
    lotteryData,
    user,
    lotteryId: id,

    // Event handlers
    setQuantity: handleQuantityChange,
  };
};

// --------------------------------------- Lottery Purchase ----------------------------------------
export const useLotteryPurchase = ({
  lotteryId,
  price,
  quantity,
  setQuantity,
  userEmail,
  lottery_status,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [selectedDelivery, setSelectedDelivery] = useState("delivery");

  // Check if lottery is live or completed
  const isLotteryActive =
    lottery_status === "live" || lottery_status === "completed";
  const isLotteryLive = lottery_status === "live";

  // Event handlers
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleBuyTicket = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckoutSession({
        lotteryId,
        quantity,
        email: userEmail,
        delivery_method: selectedDelivery,
      }).unwrap();

      if (result.url) {
        // Open Stripe in a new tab
        const stripeWindow = window.open(
          result.url,
          "_blank",
          "noopener,noreferrer"
        );
        // Poll to check if the tab is closed
        const pollTimer = setInterval(() => {
          if (stripeWindow.closed) {
            clearInterval(pollTimer);
            // Redirect to the success page using the URL-friendly set name from backend
            window.location.href = `/ticket-success/${result.urlFriendlySetName}/${result.purchase_id}`;
          }
        }, 500);
      } else {
        toast.error(result.message || "Failed to create checkout session");
      }
    } catch (err) {
      toast.error(err.data?.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliveryChange = (delivery) => {
    setSelectedDelivery(delivery);
  };

  // Computed values
  const total = (price * quantity).toFixed(2);

  return {
    // State
    isLoading,
    selectedDelivery,
    isLotteryActive,
    isLotteryLive,

    // Computed values
    total,

    // Event handlers
    handleDecrement,
    handleIncrement,
    handleBuyTicket,
    handleDeliveryChange,
  };
};

// ----------------------------- Lottery Dialog Parts ----------------------------------------
export const useLotteryDialogParts = ({ lotteryId, setName, drawDate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allParts, setAllParts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef();

  // Use shared query hook
  const {
    data: partsData,
    isLoading,
    error,
    refetch,
  } = useLotteryPartsQuery(lotteryId, {
    page: currentPage,
    limit: 20,
    sort: "name",
  });

  // Extract data using shared utility
  const extractedData = extractPartsData(partsData);

  // Update parts when data changes
  useEffect(() => {
    if (partsData?.parts) {
      if (currentPage === 1) {
        setAllParts(partsData.parts);
      } else {
        setAllParts((prev) => [...prev, ...partsData.parts]);
      }

      // Check if there are more pages to load
      const hasMorePages = extractedData.currentPage < extractedData.totalPages;
      setHasMore(hasMorePages);
      setIsLoadingMore(false);
    }
  }, [
    partsData,
    currentPage,
    extractedData.currentPage,
    extractedData.totalPages,
  ]);

  // Infinite scroll observer
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setIsLoadingMore(true);
            setCurrentPage((prev) => prev + 1);
          }
        },
        { threshold: 0.1, rootMargin: "100px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isLoadingMore, hasMore]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Reset state when dialog opens or lotteryId changes
  useEffect(() => {
    if (lotteryId) {
      setCurrentPage(1);
      setAllParts([]);
      setHasMore(true);
      setIsLoadingMore(false);
      // Force refetch to get fresh data
      setTimeout(() => refetch(), 100);
    }
  }, [lotteryId, refetch]);

  return {
    isLoading,
    error,
    allParts,
    hasMore,
    isLoadingMore,
    setName,
    drawDate,
    lastElementRef,
    hasNoData: !lotteryId || (!isLoading && allParts.length === 0),
  };
};

// ----------------------------- Lottery Parts Section ----------------------------------------
export const useLotteryPartsSection = ({ lotteryId, partsTitle }) => {
  const [paginationParams, setPaginationParams] = useState({
    sort: "name",
    page: 1,
    limit: 20,
  });

  // Use shared query hook
  const {
    data: partsData,
    isLoading,
    error,
  } = useLotteryPartsQuery(lotteryId, paginationParams);

  // Extract data using shared utility
  const extractedData = extractPartsData(partsData);

  // Handle pagination changes
  const handleParamsChange = (newParams) => {
    setPaginationParams(newParams);
  };

  // Check if we should show the pagination wrapper
  const shouldShowPaginationWrapper =
    isLoading || (extractedData.parts && extractedData.parts.length > 0);

  return {
    // Data
    parts: extractedData.parts,
    totalParts: extractedData.totalParts,
    totalPages: extractedData.totalPages,
    currentPage: extractedData.currentPage,
    startEntry: extractedData.startEntry,
    endEntry: extractedData.endEntry,
    categoryOptions: extractedData.categoryOptions,
    colorOptions: extractedData.colorOptions,
    partsTitle,

    // State
    isLoading,
    error,

    // Computed values
    shouldShowPaginationWrapper,

    // Handlers
    onParamsChange: handleParamsChange,
  };
};
