import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { toast } from "sonner";
import { selectCurrentUser } from "@/redux/features/authSlice";
import {
  useGetSocketConfigQuery,
  useGetLotteryByIdQuery,
  useGetLotteryPartsByIdQuery,
} from "@/redux/api/lotteryApi";
import {
  useGetPriorityListQuery,
  useCreatePriorityListMutation,
  useUpdatePriorityListMutation,
  paymentApi,
} from "@/redux/api/paymentApi";
import { usePlayroom } from "@/context/PlayroomContext";

export const useLiveDrawDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const currentUser = useSelector(selectCurrentUser);
  const { setIsInPlayroom } = usePlayroom();

  // Socket configuration
  const { data: socketConfig } = useGetSocketConfigQuery();
  const { data: lotteryData, isLoading: lotteryLoading } =
    useGetLotteryByIdQuery(id);

  // Main state
  const [phase, setPhase] = useState("welcome"); // welcome, rules, lobby, playroom, completed
  const [rulesOpen, setRulesOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [draftCompleted, setDraftCompleted] = useState(false);
  const [phaseInitialized, setPhaseInitialized] = useState(false);
  const [isStartingDraft, setIsStartingDraft] = useState(false);

  // Playroom-specific state
  const [pickHistory, setPickHistory] = useState([]);
  const [currentDrafter, setCurrentDrafter] = useState(null);
  const [draftCountdown, setDraftCountdown] = useState(15);
  const [pickedParts, setPickedParts] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPick, setCurrentPick] = useState(1);
  const [autoPickStatus, setAutoPickStatus] = useState({
    currentRound: false,
    nextRound: false,
  });
  // ✅ Add state to track current drafter's auto-pick status
  const [currentDrafterAutoPickStatus, setCurrentDrafterAutoPickStatus] =
    useState({
      currentRound: false,
      nextRound: false,
    });

  // Priority list state
  const [priorityViewOpen, setPriorityViewOpen] = useState(false);
  const [priorityEditOpen, setPriorityEditOpen] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectAllLoading, setSelectAllLoading] = useState(false);
  const [isSelectAllMode, setIsSelectAllMode] = useState(false);
  const [paginationParams, setPaginationParams] = useState({
    sort: "name",
    page: 1,
    limit: 20,
  });

  // Lobby animation state
  const [animatedTickets, setAnimatedTickets] = useState(tickets);
  const [isAnimating, setIsAnimating] = useState(false);
  const shuffleTimerRef = useRef(null);
  const isShufflingRef = useRef(false);

  // Computed values
  const uniqueUsers = new Set(tickets.map((t) => t.user_id));
  const readyUsers = new Set(
    tickets.filter((t) => t.status === "ready").map((t) => t.user_id)
  );
  const allReady = tickets.length > 0 && uniqueUsers.size === readyUsers.size;
  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "superAdmin";

  const sortedQueue = useMemo(() => {
    return [...tickets].sort((a, b) => a.queueNumber - b.queueNumber);
  }, [tickets]);

  // Find current user's purchase ID from their tickets
  const userPurchaseId = useMemo(() => {
    const userTicket = tickets.find(
      (ticket) => ticket.user_id === currentUser?._id
    );
    return userTicket?.purchaseId || null;
  }, [tickets, currentUser?._id]);

  // Priority list queries and mutations
  const {
    data: priorityListData,
    isLoading: isPriorityLoading,
    refetch: refetchPriorityList,
  } = useGetPriorityListQuery(
    { purchaseId: userPurchaseId, params: paginationParams },
    { skip: !userPurchaseId }
  );
  const [createPriorityList] = useCreatePriorityListMutation();
  const [updatePriorityList] = useUpdatePriorityListMutation();

  // Parts state
  const [allParts, setAllParts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPartsCount, setTotalPartsCount] = useState(0);
  const observerRef = useRef(null);

  // Fetch parts with pagination
  const {
    data: partsData,
    isLoading: isPartsLoading,
    error: partsError,
    refetch: refetchParts,
  } = useGetLotteryPartsByIdQuery(
    {
      id: lotteryData?.lottery?._id || lotteryData?.lottery?.id,
      params: {
        page: currentPage,
        limit: 20,
        sort: "name",
      },
    },
    {
      skip: !lotteryData?.lottery?._id && !lotteryData?.lottery?.id,
    }
  );

  // Update parts when data changes
  useEffect(() => {
    if (partsData?.parts) {
      if (currentPage === 1) {
        setAllParts(partsData.parts);
        // Set total parts count from API response
        setTotalPartsCount(partsData.totalParts || 0);
      } else {
        setAllParts((prev) => [...prev, ...partsData.parts]);
      }

      // Check if there are more pages to load
      const hasMorePages = partsData.page < partsData.totalPages;
      setHasMore(hasMorePages);
      setIsLoadingMore(false);
    }
  }, [partsData, currentPage]);

  // Reset state when lotteryData changes
  useEffect(() => {
    if (lotteryData?.lottery?._id || lotteryData?.lottery?.id) {
      setCurrentPage(1);
      setAllParts([]);
      setHasMore(true);
      setIsLoadingMore(false);
      // Force refetch to get fresh data
      setTimeout(() => refetchParts(), 100);
    }
  }, [lotteryData?.lottery?._id, lotteryData?.lottery?.id, refetchParts]);

  // Filter out picked parts - only show available parts
  const availableParts = useMemo(() => {
    return allParts.filter(
      (part) =>
        !pickedParts.includes(part._id.toString()) &&
        !pickedParts.includes(part._id)
    );
  }, [allParts, pickedParts]);

  // Infinite scroll observer
  const lastElementRef = useCallback(
    (node) => {
      if (isPartsLoading || isLoadingMore) return;

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
    [isPartsLoading, isLoadingMore, hasMore]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Computed values for parts
  const isCurrentUserTurn = currentDrafter?.user_id === currentUser?._id;

  // DraftQueue auto-scroll refs
  const scrollContainerRef = useRef(null);
  const currentDrafterRef = useRef(null);

  // Auto-scroll to current drafter when they change
  useEffect(() => {
    if (currentDrafter && scrollContainerRef.current) {
      // Small delay to ensure DOM is fully updated
      const scrollTimeout = setTimeout(() => {
        const scrollContainer = scrollContainerRef.current;

        // Find the current drafter element by data attribute instead of ref
        const currentDrafterElement = scrollContainer.querySelector(
          `[data-ticket-id="${currentDrafter.ticket_id}"]`
        );

        if (!scrollContainer || !currentDrafterElement) {
          return;
        }

        // Calculate the position to scroll to within the container
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = currentDrafterElement.getBoundingClientRect();

        // Check if the current drafter is not fully visible within the container
        const isVisible =
          elementRect.top >= containerRect.top &&
          elementRect.bottom <= containerRect.bottom;

        if (!isVisible) {
          // Calculate scroll position within the container
          const scrollTop =
            currentDrafterElement.offsetTop -
            scrollContainer.offsetTop -
            scrollContainer.clientHeight / 2 +
            currentDrafterElement.clientHeight / 2;

          // Scroll within the container only
          scrollContainer.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: "smooth",
          });
        }
      }, 200); // 200ms delay to ensure DOM is fully updated

      return () => clearTimeout(scrollTimeout);
    }
  }, [currentDrafter?.ticket_id]); // Only trigger when current drafter changes

  // PriorityListViewDialog state
  const [hasValidPurchaseId, setHasValidPurchaseId] = useState(false);

  // Check if we have a valid purchase ID
  useEffect(() => {
    setHasValidPurchaseId(!!userPurchaseId);
  }, [userPurchaseId]);

  // Fetch priority list for view dialog
  const {
    data: priorityViewData,
    isLoading: isPriorityViewLoading,
    error: priorityViewError,
  } = useGetPriorityListQuery(
    {
      purchaseId: userPurchaseId,
      params: { limit: "all" },
    },
    {
      skip: !hasValidPurchaseId,
    }
  );

  // Calculate priority list statistics
  const priorityListStats = useMemo(() => {
    if (!priorityListData?.priorityList?.priorityItems) {
      return { userPriorityCount: 0, pickedPriorityCount: 0 };
    }

    const priorityItems = priorityListData.priorityList.priorityItems;
    const userPriorityCount = priorityItems.length;
    const pickedPriorityCount = priorityItems.filter(
      (item) =>
        pickedParts.includes(item.item._id.toString()) ||
        pickedParts.includes(item.item._id)
    ).length;

    return { userPriorityCount, pickedPriorityCount };
  }, [priorityListData?.priorityList?.priorityItems, pickedParts]);

  // Compute available parts for priority list (not in selectedParts)
  const availablePriorityParts = useMemo(() => {
    if (!priorityListData?.parts) return [];
    const selectedIds = new Set(selectedParts.map((p) => p.item._id || p.item));
    return priorityListData.parts.filter((part) => !selectedIds.has(part._id));
  }, [priorityListData, selectedParts]);

  // Lobby animation helpers
  const shuffleArray = useCallback((array) => {
    const arr = [...array];
    const n = arr.length;
    if (n <= 1) return arr;
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    for (let i = 0; i < n; i++) {
      if (arr[i] === array[i]) {
        const k = (i + 1) % n;
        [arr[i], arr[k]] = [arr[k], arr[i]];
      }
    }
    return arr;
  }, []);

  const scheduleNextStep = useCallback(() => {
    if (!isShufflingRef.current) return;
    shuffleTimerRef.current = setTimeout(() => {
      setAnimatedTickets((prev) =>
        prev.length ? shuffleArray(prev) : shuffleArray(tickets)
      );
      scheduleNextStep();
    }, 950); // STEP_DELAY_MS
  }, [shuffleArray, tickets]);

  // Effects
  useEffect(() => {
    if (connected && !phaseInitialized) {
      const fallbackTimer = setTimeout(() => {
        setPhase("welcome");
        setPhaseInitialized(true);
      }, 5000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [connected, phaseInitialized]);

  useEffect(() => {
    if (!socketConfig?.socketUrl || !id) return;

    socketRef.current = io(socketConfig.socketUrl);
    const socket = socketRef.current;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("joinLiveDrawRoom", { drawId: id, userId: currentUser?._id });
      // Ensure viewers (including guests) sync full current state on refresh/join
      socket.emit("requestDraftState", {
        drawId: id,
        userId: currentUser?._id,
      });
      setLoading(false);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("phaseUpdate", (data) => {
      setPhase(data.phase);
      setPhaseInitialized(true);

      if (data.phase === "playroom") {
        setCountdown(0);
        setIsShuffling(false);
        setIsInPlayroom(true);
      } else {
        setIsInPlayroom(false);
      }
    });

    socket.on("ticketUpdate", (data) => {
      const newTickets = data.tickets || [];
      setTickets(newTickets);
    });

    socket.on("countdownStart", (data) => {
      setCountdown(data.seconds);
    });

    socket.on("countdownTick", (data) => {
      setCountdown(data.seconds);
    });

    socket.on("countdownCancel", () => {
      setCountdown(0);
    });

    socket.on("shufflingStart", () => {
      setIsShuffling(true);
      // Keep isStartingDraft true during shuffling - it will be reset when draft actually starts
    });

    socket.on("shufflingEnd", (data) => {
      setIsShuffling(false);
      setTickets(data.tickets || []);
    });

    socket.on("draftState", (data) => {
      if (data.currentDrafter) {
        setCurrentDrafter(data.currentDrafter);
      }

      if (data.countdown !== undefined) {
        setDraftCountdown(data.countdown);
      }

      if (data.round) {
        setCurrentRound(data.round);
      }

      if (data.pick) {
        setCurrentPick(data.pick);
      }

      if (data.pickHistory && data.pickHistory.length > 0) {
        setPickHistory(data.pickHistory);

        const allPickedPartIds = data.pickHistory.map((pick) => pick.part._id);
        setPickedParts(allPickedPartIds);
      } else {
        const newPickEntry = {
          user: data.user || { name: "Unknown User", _id: "unknown" },
          part: data.part || { name: "Unknown Part", _id: "unknown" },
          ticket_id: data.ticket_id || "unknown",
          round_number: data.round_number || data.round || 1,
          pick_method: data.pick_method || "manual",
          timestamp: data.timestamp || new Date(),
        };

        setPickHistory((prev) => {
          const updated = [newPickEntry, ...prev];
          return updated;
        });
      }

      if (data.autoPickStatus) {
        setAutoPickStatus(data.autoPickStatus);
      }
    });

    socket.on("autoPickStatusUpdate", (data) => {
      // ✅ Update current drafter's auto-pick status if it's for the current drafter
      if (data.userId === currentDrafter?.user_id) {
        setCurrentDrafterAutoPickStatus(data.autoPickStatus);
      }

      // Update current user's auto-pick status
      if (data.userId === currentUser?._id) {
        setAutoPickStatus(data.autoPickStatus);
        // ✅ Removed all auto-pick toast notifications for cleaner UX
      }
    });

    socket.on("draftStarted", (data) => {
      setCurrentDrafter(data.currentDrafter);
      setDraftCountdown(data.countdown || 15);
      setPickHistory([]);
      setPickedParts([]);
      setCurrentRound(data.round || 1);
      setCurrentPick(data.pick || 1);
      setIsStartingDraft(false); // Reset the starting state when draft actually starts
    });

    socket.on("draftCountdownTick", (data) => {
      const countdown = Math.max(0, data.seconds);
      setDraftCountdown(countdown);
    });

    socket.on("partPicked", (data) => {
      if (data.part) {
        setPickedParts((prev) => [...prev, data.part._id]);
      }

      if (data.pickHistory && data.pickHistory.length > 0) {
        setPickHistory(data.pickHistory);

        const allPickedPartIds = data.pickHistory.map((pick) => pick.part._id);
        setPickedParts(allPickedPartIds);
      } else {
        const newPickEntry = {
          user: data.user || { name: "Unknown User", _id: "unknown" },
          part: data.part || { name: "Unknown Part", _id: "unknown" },
          ticket_id: data.ticket_id || "unknown",
          round_number: data.round_number || data.round || 1,
          pick_method: data.pick_method || "manual",
          timestamp: data.timestamp || new Date(),
        };

        setPickHistory((prev) => {
          const updated = [newPickEntry, ...prev];
          return updated;
        });
      }

      setCurrentDrafter(data.nextDrafter);
      setDraftCountdown(data.countdown || 15);
      setCurrentRound(data.round || 1);
      setCurrentPick(data.pick || 1);

      // ✅ Show standardized toast based on pick method for all users
      let pickMethodText = "✋ Manual Pick";
      let toastStyle = {};

      if (data.pick_method === "afk") {
        pickMethodText = "⚡ AFK Auto-Pick";
        toastStyle = {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          border: "1px solid #f87171",
        };
      } else if (data.pick_method === "auto") {
        pickMethodText = "🤖 Auto-Pick";
        toastStyle = {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          border: "1px solid #34d399",
        };
      } else {
        // Manual pick - use toast.success (green)
        toast.success(
          `${pickMethodText}: ${data.user?.name || "Unknown User"} got ${
            data.part?.name || "Unknown Part"
          }!`,
          {
            duration: 3000,
          }
        );
        return; // Exit early for manual pick to avoid duplicate toast
      }

      // For auto-pick and AFK, use custom styled toast
      toast.info(
        `${pickMethodText}: ${data.user?.name || "Unknown User"} got ${
          data.part?.name || "Unknown Part"
        }!`,
        {
          duration: 3000,
          style: toastStyle,
        }
      );
    });

    socket.on("draftCompleted", (data) => {
      setCurrentDrafter(null);
      setDraftCountdown(0);
      setPickHistory(data.pickHistory || []);
      setDraftCompleted(true);
      setPhase("completed");
      setIsInPlayroom(false);
      toast.success(
        `🎉 Draft completed! ${data.totalPicks} parts distributed.`,
        {
          duration: 5000,
        }
      );
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);

      if (error.message?.includes("already picked")) {
        toast.error("This part was already picked by another user", {
          description: "Please select a different part",
          duration: 4000,
        });
      } else if (error.message?.includes("not found")) {
        toast.error("Part not found in this lottery", {
          description: "The part may have been removed",
          duration: 4000,
        });
      } else if (error.message?.includes("no longer available")) {
        toast.error("Part is no longer available", {
          description: "Please refresh and try again",
          duration: 4000,
        });
      } else {
        toast.error(error.message || "An error occurred");
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
      setIsInPlayroom(false);
    };
  }, [socketConfig, id, currentUser, setIsInPlayroom]);

  useEffect(() => {
    setIsInPlayroom(phase === "playroom");
  }, [phase, setIsInPlayroom]);

  // Lobby animation effects
  useEffect(() => {
    if (!isAnimating && !isShuffling) {
      setAnimatedTickets(tickets);
    }
  }, [tickets, isAnimating, isShuffling]);

  useEffect(() => {
    isShufflingRef.current = isShuffling;

    if (isShuffling) {
      setIsAnimating(true);
      setAnimatedTickets((prev) =>
        prev.length ? shuffleArray(prev) : shuffleArray(tickets)
      );
      scheduleNextStep();
      return () => {
        if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current);
      };
    }

    if (!isShuffling) {
      if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current);
      setAnimatedTickets(tickets);
      setIsAnimating(false);
    }
  }, [isShuffling, tickets, shuffleArray, scheduleNextStep]);

  // Priority list effects
  useEffect(() => {
    if (priorityListData?.priorityList?.priorityItems) {
      setSelectedParts(priorityListData.priorityList.priorityItems);
    } else {
      setSelectedParts([]);
    }
  }, [priorityListData?.priorityList?.priorityItems]);

  // Event handlers
  const handleToggleReady = (isReady) => {
    if (socketRef.current) {
      socketRef.current.emit(isReady ? "userReady" : "userNotReady", {
        drawId: id,
        userId: currentUser?._id,
      });
    }
  };

  const handleStartDraft = () => {
    if (socketRef.current) {
      setIsStartingDraft(true);
      socketRef.current.emit("startDraft", {
        drawId: id,
        forceStart: !allReady,
      });
    }
  };

  const handlePartPick = (part) => {
    if (socketRef.current && currentDrafter?.user_id === currentUser?._id) {
      socketRef.current.emit("pickPart", {
        drawId: id,
        userId: currentUser._id,
        partId: part._id,
      });
    }
  };

  const handleAutoPickToggle = (enabled) => {
    if (socketRef.current) {
      socketRef.current.emit("updateAutoPickSettings", {
        drawId: id,
        userId: currentUser._id,
        enabled: enabled,
        forNextRound: enabled,
      });
    }
  };

  const handleReadRules = () => {
    setRulesOpen(true);
  };

  const handleStartPlaying = () => {
    setPhase("lobby");
  };

  const handleRulesUnderstood = () => {
    setRulesOpen(false);
    setPhase("lobby");
  };

  const handleRulesClose = () => {
    setRulesOpen(false);
  };

  const handleCountdownComplete = () => {
    setPhase("playroom");
  };

  const handleViewResults = () => {
    // Navigate to results page or show results dialog
  };

  const handleBackToDraws = () => {
    navigate("/live-draw");
  };

  // Priority list handlers
  const handlePriorityListClick = () => {
    setPriorityViewOpen(true);
  };

  const handlePriorityListEdit = () => {
    setPriorityViewOpen(false);
    setPriorityEditOpen(true);
  };

  const handlePriorityEditClose = () => {
    setPriorityEditOpen(false);
    setPriorityViewOpen(true);
  };

  const handlePaginationChange = (params) => {
    setPaginationParams(params);
    setIsSelectAllMode(false);
  };

  const handleAddPart = (part) => {
    if (selectedParts.some((p) => (p.item._id || p.item) === part._id)) return;
    setSelectedParts([
      ...selectedParts,
      {
        item: part,
        priority: selectedParts.length + 1,
      },
    ]);
    setIsSelectAllMode(false);
  };

  const handleRemovePart = (partId) => {
    setSelectedParts(
      selectedParts.filter((p) => (p.item._id || p.item) !== partId)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const priorityItems = selectedParts.map((p, i) => ({
        item: p.item._id || p.item,
        priority: i + 1,
      }));

      let result;
      if (priorityListData?.priorityList) {
        result = await updatePriorityList({
          purchaseId: userPurchaseId,
          priorityItems,
        }).unwrap();
      } else {
        result = await createPriorityList({
          purchaseId: userPurchaseId,
          priorityItems,
        }).unwrap();
      }

      refetchPriorityList();
      setPriorityEditOpen(false);
      setPriorityViewOpen(true);
      toast.success(result?.message || "Priority list saved successfully");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to save priority list"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = async () => {
    setSelectAllLoading(true);
    setIsSelectAllMode(true);
    try {
      const result = await dispatch(
        paymentApi.endpoints.getPriorityList.initiate({
          purchaseId: userPurchaseId,
          params: {
            ...paginationParams,
            limit: "all",
          },
        })
      ).unwrap();
      const resultParts = result.parts || [];
      const selectedIds = new Set(
        selectedParts.map((p) => p.item._id || p.item)
      );
      const toAdd = resultParts.filter((part) => !selectedIds.has(part._id));
      setSelectedParts([
        ...selectedParts,
        ...toAdd.map((part, idx) => ({
          item: part,
          priority: selectedParts.length + idx + 1,
        })),
      ]);
      toast.success("All parts added to your priority list");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to select all parts"
      );
    } finally {
      setSelectAllLoading(false);
    }
  };

  const handleClearAll = () => {
    setSelectedParts([]);
    setIsSelectAllMode(false);
    toast.success("Priority list cleared");
  };

  return {
    // State
    phase,
    rulesOpen,
    setRulesOpen,
    tickets,
    countdown,
    isShuffling,
    loading,
    connected,
    draftCompleted,
    phaseInitialized,
    isStartingDraft,
    pickHistory,
    currentDrafter,
    draftCountdown,
    pickedParts,
    currentRound,
    currentPick,
    autoPickStatus,
    priorityViewOpen,
    setPriorityViewOpen,
    priorityEditOpen,
    selectedParts,
    saving,
    selectAllLoading,
    isSelectAllMode,
    paginationParams,
    animatedTickets,
    isAnimating,
    priorityListData,
    isPriorityLoading,
    availablePriorityParts,
    priorityListStats,
    userPurchaseId,
    lotteryData,
    lotteryLoading,
    currentUser,

    // Parts data
    allParts,
    isPartsLoading,
    isLoadingMore,
    hasMore,
    partsError,
    availableParts,
    isCurrentUserTurn,
    lastElementRef,
    totalPartsCount,

    // DraftQueue refs
    scrollContainerRef,
    currentDrafterRef,

    // PriorityListViewDialog data
    priorityViewData,
    isPriorityViewLoading,
    priorityViewError,
    hasValidPurchaseId,

    // Computed values
    uniqueUsers: uniqueUsers.size,
    readyUsers: readyUsers.size,
    allReady,
    isAdmin,
    sortedQueue,

    // Event handlers
    handleToggleReady,
    handleStartDraft,
    handlePartPick,
    handleAutoPickToggle,
    handleReadRules,
    handleStartPlaying,
    handleRulesUnderstood,
    handleRulesClose,
    handleCountdownComplete,
    handleViewResults,
    handleBackToDraws,
    handlePriorityListClick,
    handlePriorityListEdit,
    handlePriorityEditClose,
    handlePaginationChange,
    handleAddPart,
    handleRemovePart,
    handleSave,
    handleSelectAll,
    handleClearAll,

    // Refs
    socketRef,
  };
};
