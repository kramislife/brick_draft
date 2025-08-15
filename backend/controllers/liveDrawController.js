import OptimizedRoomState from "../utills/live-draw/OptimizedRoomState.js";
import DraftAlgorithm from "../utills/live-draw/DraftAlgorithm.js";
import ThrottledEmitter from "../utills/live-draw/ThrottledEmitter.js";
import DataPreloader from "../utills/live-draw/DataPreloader.js";
import Lottery from "../models/lottery.model.js";
import DraftResult from "../models/draft_result.model.js";

// Global instances
const dataPreloader = new DataPreloader();
const draftRooms = new Map(); // lotteryId -> OptimizedRoomState

// Helper function to get or create room state
const getRoomState = (drawId) => {
  if (!draftRooms.has(drawId)) {
    draftRooms.set(drawId, new OptimizedRoomState(drawId));
  }
  return draftRooms.get(drawId);
};

// Initialize draft result document
const initializeDraftResult = async (lotteryId, tickets) => {
  try {
    const lottery = await Lottery.findById(lotteryId);
    if (!lottery) return null;

    const ticketResults = tickets.map((ticket) => ({
      ticket_id: ticket.ticket_id,
      user_id: ticket.user_id,
      queue_number: ticket.queueNumber,
      won_parts: [],
      total_parts_won: 0,
      total_value: 0,
    }));

    const draftResult = new DraftResult({
      lottery: {
        lottery_id: lotteryId,
        set_name: lottery.title,
      },
      draft_status: "in_progress",
      started_at: new Date(),
      total_rounds: Math.ceil(lottery.parts.length / tickets.length),
      ticket_results: ticketResults,
      draft_stats: {
        total_participants: new Set(tickets.map((t) => t.user_id)).size,
        total_tickets: tickets.length,
        total_parts_distributed: 0,
        total_value_distributed: 0,
        highest_value_ticket: 0,
        lowest_value_ticket: 0,
      },
      created_by: tickets[0]?.user_id,
    });

    await draftResult.save();
    return draftResult;
  } catch (error) {
    console.error("Error initializing draft result:", error);
    return null;
  }
};

// Batch update draft results
const batchUpdateDraftResults = async (updates) => {
  try {
    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: {
          "lottery.lottery_id": update.lotteryId,
          "ticket_results.ticket_id": update.ticketId,
        },
        update: {
          $push: { "ticket_results.$.won_parts": update.pickData },
          $inc: {
            "ticket_results.$.total_parts_won": 1,
            "ticket_results.$.total_value": update.partValue,
            "draft_stats.total_parts_distributed": 1,
            "draft_stats.total_value_distributed": update.partValue,
          },
        },
      },
    }));

    await DraftResult.bulkWrite(bulkOps);
  } catch (error) {
    console.error("Error batch updating draft results:", error);
  }
};

// Complete draft
const completeDraft = async (lotteryId) => {
  try {
    const draftResult = await DraftResult.findOne({
      "lottery.lottery_id": lotteryId,
    });

    if (!draftResult) return;

    draftResult.draft_status = "completed";
    draftResult.completed_at = new Date();
    await draftResult.save();

    // Update lottery status
    await Lottery.findByIdAndUpdate(lotteryId, {
      lottery_status: "completed",
    });

    // Emit status update
    const io = global.io;
    if (io) {
      io.emit("statusUpdate", {
        lotteryId: lotteryId,
        newStatus: "completed",
      });
    }
  } catch (error) {
    console.error("Error completing draft:", error);
  }
};

// Handle part pick (optimized)
const handlePartPick = async (
  io,
  drawId,
  roomState,
  partId,
  pickMethod = "manual"
) => {
  const startTime = Date.now();

  try {
    // Validate pick
    const validation = DraftAlgorithm.validatePick(
      roomState,
      partId,
      roomState.currentDrafter.user_id
    );
    if (!validation.valid) {
      return { success: false, reason: validation.reason };
    }

    // Get user data from cache
    const userId = roomState.currentDrafter.user_id?.toString();
    const userData = dataPreloader.getUserData(userId);

    if (!userData) {
      console.error("❌ User data not found for userId:", userId);
      return { success: false, reason: "User data not found" };
    }

    // Perform pick
    const pickSuccess = roomState.pickPart(partId, userData, pickMethod);
    if (!pickSuccess) {
      // ✅ Provide more specific error messages
      if (!roomState.availableParts.has(partId.toString())) {
        return { success: false, reason: "Part not found in lottery" };
      } else if (roomState.pickHistoryManager.isPartPicked(partId)) {
        return {
          success: false,
          reason: "Part was already picked by another user",
        };
      } else {
        return { success: false, reason: "Part is no longer available" };
      }
    }

    // Get the picked part data
    const pickedPart = roomState.pickHistoryManager.getPartData(partId);

    // Update draft result in background (non-blocking)
    const updateData = {
      lotteryId: drawId,
      ticketId: roomState.currentDrafter.ticket_id,
      partId: partId,
      roundNumber: roomState.currentRound,
      pickMethod: pickMethod,
      partValue: pickedPart.total_value || 0,
      pickData: {
        part_id: pickedPart._id, // Use _id as part_id (required by schema)
        item_id: pickedPart.item_id, // Fallback item_id
        round_number: roomState.currentRound,
        pick_time: new Date(),
      },
    };

    // Queue for batch update
    setTimeout(() => {
      batchUpdateDraftResults([updateData]);
    }, 0);

    // Calculate next drafter
    const nextDrafter = DraftAlgorithm.getNextDrafter(roomState);
    roomState.currentDrafter = nextDrafter;

    // ✅ Emit auto-pick status update for the new drafter
    const statusEmitter = new ThrottledEmitter(io, drawId);
    const nextUserId = nextDrafter?.user_id?.toString();
    if (nextUserId) {
      statusEmitter.emit("autoPickStatusUpdate", {
        userId: nextUserId,
        enabled: roomState.hasAutoPickEnabled(nextUserId),
        forNextRound: false,
        autoPickStatus: roomState.getAutoPickStatus(nextUserId),
      });
    }

    // Check if draft is complete
    if (DraftAlgorithm.isDraftComplete(roomState)) {
      await handleDraftComplete(io, drawId, roomState);
      return { success: true, draftComplete: true };
    }

    // Start countdown for next drafter
    startDraftCountdown(io, drawId, roomState, nextDrafter);

    // Emit optimized part picked event
    const emitter = new ThrottledEmitter(io, drawId);
    emitter.emitImmediate("partPicked", {
      user: userData,
      part: pickedPart,
      ticket_id: roomState.currentDrafter?.ticket_id,
      round_number: roomState.currentRound,
      pick_method: pickMethod,
      timestamp: new Date(),
      nextDrafter: nextDrafter,
      countdown: roomState.draftCountdown,
      round: roomState.currentRound,
      pick: roomState.currentPick,
      totalPicks: roomState.pickHistoryManager.getTotalPicks(),
    });

    // Update metrics
    roomState.metrics.pickLatency = Date.now() - startTime;

    return { success: true };
  } catch (error) {
    console.error("Error in handlePartPick:", error);
    return { success: false, reason: "Internal error" };
  }
};

// Handle auto-pick (enhanced with priority logic)
const handleAutoPick = async (io, drawId, roomState, pickMethod = "afk") => {
  try {
    const currentDrafter = roomState.currentDrafter;
    const userId = currentDrafter?.user_id?.toString();

    roomState.clearDraftCountdown();

    if (!currentDrafter || roomState.phase !== "playroom") {
      return false;
    }

    // Check if draft is complete
    if (DraftAlgorithm.isDraftComplete(roomState)) {
      await handleDraftComplete(io, drawId, roomState);
      return true;
    }

    // Perform enhanced auto-pick with priority logic
    const selectedPart = DraftAlgorithm.performOptimizedAutoPick(
      roomState,
      currentDrafter
    );

    if (selectedPart) {
      await handlePartPick(
        io,
        drawId,
        roomState,
        selectedPart._id.toString(),
        pickMethod
      );
      return true;
    } else {
      await handleDraftComplete(io, drawId, roomState);
      return false;
    }
  } catch (error) {
    console.error("❌ Error in handleAutoPick:", error);
    return false;
  }
};

// Start initial countdown (after shuffling)
const startInitialCountdown = (emitter, roomState, drawId, io) => {
  roomState.countdown = 10;
  roomState.countdownInterval = setInterval(async () => {
    roomState.countdown--;

    if (roomState.countdown > 0) {
      emitter.emit("countdownTick", { seconds: roomState.countdown });
    } else {
      roomState.clearCountdown();
      roomState.phase = "playroom";
      roomState.currentRound = 1;
      roomState.currentPick = 1;

      // Initialize draft result
      await initializeDraftResult(drawId, roomState.tickets);

      // Calculate first drafter
      const firstDrafter = DraftAlgorithm.calculateCurrentDrafter(
        roomState.tickets,
        roomState.currentRound,
        roomState.currentPick
      );

      if (firstDrafter) {
        roomState.currentDrafter = firstDrafter;
        startDraftCountdown(io, drawId, roomState, firstDrafter);

        emitter.emitImmediate("phaseUpdate", { phase: "playroom" });
        emitter.emitImmediate("draftStarted", {
          currentDrafter: firstDrafter,
          countdown: roomState.draftCountdown,
          round: roomState.currentRound,
          pick: roomState.currentPick,
        });
      }
    }
  }, 1000);
};

// Start draft countdown
const startDraftCountdown = (io, drawId, roomState, nextDrafter) => {
  roomState.clearDraftCountdown();

  roomState.draftCountdown = 15;
  roomState.currentDrafter = nextDrafter;

  // Check auto-pick settings
  const currentUserId = nextDrafter.user_id?.toString();
  const hasAutoPickEnabled = roomState.hasAutoPickEnabled(currentUserId);

  // ✅ Emit auto-pick status update to all clients when new drafter starts
  const emitter = new ThrottledEmitter(io, drawId);
  emitter.emit("autoPickStatusUpdate", {
    userId: currentUserId,
    enabled: hasAutoPickEnabled,
    forNextRound: false, // This is current round now
    autoPickStatus: roomState.getAutoPickStatus(currentUserId),
  });

  if (hasAutoPickEnabled) {
    // Auto-pick after 5 seconds for user-triggered auto-pick
    setTimeout(async () => {
      await handleAutoPick(io, drawId, roomState, "auto");
    }, 5000);
  }

  // Start countdown
  roomState.draftCountdownInterval = setInterval(async () => {
    roomState.draftCountdown--;

    if (roomState.draftCountdown <= 0) {
      roomState.clearDraftCountdown();
      await handleAutoPick(io, drawId, roomState, "afk");
    } else {
      const emitter = new ThrottledEmitter(io, drawId);
      emitter.emit("draftCountdownTick", {
        seconds: roomState.draftCountdown,
      });
    }
  }, 1000);
};

// Handle draft completion
const handleDraftComplete = async (io, drawId, roomState) => {
  try {
    roomState.clearDraftCountdown();
    roomState.phase = "completed";
    roomState.currentDrafter = null;
    roomState.draftCountdown = 0;

    // Complete draft in database
    await completeDraft(drawId);

    // Emit completion event
    const emitter = new ThrottledEmitter(io, drawId);
    emitter.emitImmediate("draftCompleted", {
      totalPicks: roomState.pickHistoryManager.getTotalPicks(),
      pickHistory: roomState.pickHistoryManager.getPickHistory(),
    });

    // Cleanup room state after delay
    setTimeout(() => {
      roomState.cleanup();
      draftRooms.delete(drawId);
      dataPreloader.clearLotteryCache(drawId);
    }, 300000); // 5 minutes
  } catch (error) {
    console.error("Error in handleDraftComplete:", error);
  }
};

// Socket event handlers
export const handleLiveDrawSockets = (io) => {
  io.on("connection", (socket) => {
    // Join live draw room
    socket.on("joinLiveDrawRoom", async ({ drawId, userId }) => {
      try {
        socket.join(drawId);
        const roomState = getRoomState(drawId);
        roomState.participants.add(socket.id);

        // Pre-load data if not already loaded
        if (roomState.tickets.length === 0) {
          try {
            const { lottery, tickets } = await dataPreloader.preloadDraftData(
              drawId
            );
            roomState.tickets = tickets;
            roomState.setLotteryData(lottery);

            // Set priority lists for all users (only if there are tickets)
            if (tickets && tickets.length > 0) {
              tickets.forEach((ticket) => {
                const priorityList = dataPreloader.getPriorityList(
                  ticket.user_id,
                  drawId
                );
                roomState.setUserPriorityList(ticket.user_id, priorityList);
              });
            }
          } catch (preloadError) {
            console.warn(
              "⚠️ Could not preload draft data (might be guest or no tickets yet):",
              preloadError.message
            );
            // Continue without tickets - this is fine for guests
          }
        }

        // Verify parts are loaded (only if we have lottery data)
        const lotteryData = dataPreloader.getLotteryData(drawId);
        if (!lotteryData) {
          socket.emit("error", {
            message: "Lottery not found or not available for viewing.",
          });
          return;
        }

        if (!dataPreloader.isLotteryDataLoaded(drawId)) {
          socket.emit("error", {
            message:
              "Parts are still loading. Please wait a moment and try again.",
          });
          return;
        }

        // Send initial state
        socket.emit("phaseUpdate", { phase: roomState.phase });
        socket.emit("ticketUpdate", { tickets: roomState.tickets || [] });

        // ✅ Send current draft state if in playroom phase
        if (roomState.phase === "playroom") {
          socket.emit("draftState", {
            currentDrafter: roomState.currentDrafter,
            countdown: roomState.draftCountdown,
            round: roomState.currentRound,
            pick: roomState.currentPick,
            pickHistory: roomState.pickHistoryManager.getPickHistory(),
            totalPicks: roomState.pickHistoryManager.getTotalPicks(),
            autoPickStatus: roomState.getAutoPickStatus(userId),
          });
        }

        if (roomState.countdown > 0) {
          socket.emit("countdownStart", { seconds: roomState.countdown });
        }

        if (roomState.isShuffling) {
          socket.emit("shufflingStart");
        }
      } catch (error) {
        console.error("Error in joinLiveDrawRoom:", error);
        socket.emit("error", { message: "Failed to join live draw room" });
      }
    });

    // ✅ Allow clients to request the latest state (useful on refresh/late join)
    socket.on("requestDraftState", async ({ drawId, userId }) => {
      try {
        const roomState = getRoomState(drawId);

        // Always provide phase and tickets
        socket.emit("phaseUpdate", { phase: roomState.phase });
        socket.emit("ticketUpdate", { tickets: roomState.tickets || [] });

        // Provide playroom details if applicable
        if (roomState.phase === "playroom") {
          socket.emit("draftState", {
            currentDrafter: roomState.currentDrafter,
            countdown: roomState.draftCountdown,
            round: roomState.currentRound,
            pick: roomState.currentPick,
            pickHistory: roomState.pickHistoryManager.getPickHistory(),
            totalPicks: roomState.pickHistoryManager.getTotalPicks(),
            // Send actual auto-pick status for the user (or default for guests)
            autoPickStatus: roomState.getAutoPickStatus(userId),
          });
        }

        if (roomState.countdown > 0) {
          socket.emit("countdownStart", { seconds: roomState.countdown });
        }

        if (roomState.isShuffling) {
          socket.emit("shufflingStart");
        }
      } catch (error) {
        console.error("Error in requestDraftState:", error);
        socket.emit("error", { message: "Failed to fetch draft state" });
      }
    });

    // Handle user ready status
    socket.on("userReady", async ({ drawId, userId }) => {
      try {
        const roomState = getRoomState(drawId);
        const updatedCount = roomState.updateTicketStatus(userId, "ready");

        if (updatedCount > 0) {
          const emitter = new ThrottledEmitter(io, drawId);
          emitter.emit("ticketUpdate", { tickets: roomState.tickets });
        }
      } catch (error) {
        socket.emit("error", { message: "Failed to update ready status" });
      }
    });

    // Handle user not ready status
    socket.on("userNotReady", async ({ drawId, userId }) => {
      try {
        const roomState = getRoomState(drawId);
        const updatedCount = roomState.updateTicketStatus(userId, "waiting");

        if (updatedCount > 0) {
          const emitter = new ThrottledEmitter(io, drawId);
          emitter.emit("ticketUpdate", { tickets: roomState.tickets });
        }
      } catch (error) {
        socket.emit("error", { message: "Failed to update ready status" });
      }
    });

    // Handle start draft
    socket.on("startDraft", async ({ drawId, forceStart = false }) => {
      try {
        const roomState = getRoomState(drawId);

        // Check if all parts are loaded
        if (!dataPreloader.isLotteryDataLoaded(drawId)) {
          socket.emit("error", {
            message:
              "Parts are still loading. Please wait a moment and try again.",
          });
          return;
        }

        if (!forceStart && !roomState.areAllUsersReady()) {
          socket.emit("error", { message: "Not all participants are ready" });
          return;
        }

        // Mark all as ready if force starting
        if (forceStart) {
          roomState.tickets.forEach((ticket) => {
            if (ticket.status === "waiting") {
              ticket.status = "ready";
            }
          });
        }

        // Start shuffling
        roomState.isShuffling = true;
        const emitter = new ThrottledEmitter(io, drawId);
        emitter.emitImmediate("shufflingStart");

        // Shuffle and assign queue numbers
        setTimeout(async () => {
          const shuffledTickets = DraftAlgorithm.shuffleArray(
            roomState.tickets
          );
          shuffledTickets.forEach((ticket, index) => {
            ticket.queueNumber = index + 1;
          });

          roomState.tickets = shuffledTickets;
          roomState.isShuffling = false;

          emitter.emitImmediate("shufflingEnd", { tickets: roomState.tickets });

          // Check if parts are loaded before starting countdown
          if (!dataPreloader.isLotteryDataLoaded(drawId)) {
            // Wait 2 seconds and check again
            setTimeout(() => {
              if (dataPreloader.isLotteryDataLoaded(drawId)) {
                startInitialCountdown(emitter, roomState, drawId, io);
              } else {
                socket.emit("error", {
                  message:
                    "Parts are still loading. Please wait and try again.",
                });
              }
            }, 2000);
            return;
          }

          // Start initial countdown
          startInitialCountdown(emitter, roomState, drawId, io);
        }, 5000);
      } catch (error) {
        socket.emit("error", { message: "Failed to start draft" });
      }
    });

    // Handle manual part pick
    socket.on("pickPart", async ({ drawId, userId, partId }) => {
      try {
        const roomState = getRoomState(drawId);
        const result = await handlePartPick(
          io,
          drawId,
          roomState,
          partId,
          "manual"
        );

        if (!result.success) {
          socket.emit("error", { message: result.reason });
        }
      } catch (error) {
        socket.emit("error", { message: "Failed to pick part" });
      }
    });

    // Handle auto-pick request
    socket.on("requestAutoPick", async ({ drawId, userId }) => {
      try {
        const roomState = getRoomState(drawId);
        const success = await handleAutoPick(io, drawId, roomState, "auto");

        if (!success) {
          socket.emit("error", { message: "Auto-pick failed" });
        }
      } catch (error) {
        socket.emit("error", { message: "Failed to auto-pick" });
      }
    });

    // Handle auto-pick settings
    socket.on(
      "updateAutoPickSettings",
      async ({ drawId, userId, enabled, forNextRound = false }) => {
        try {
          const roomState = getRoomState(drawId);

          // ✅ Simplified logic: always schedule for next round when enabled
          if (enabled) {
            roomState.setAutoPick(userId, true, true); // Always for next round
          } else {
            roomState.setAutoPick(userId, false, false); // Disable both current and next round
          }

          // Emit auto-pick status update to all users
          const emitter = new ThrottledEmitter(io, drawId);
          emitter.emit("autoPickStatusUpdate", {
            userId: userId,
            enabled: enabled,
            forNextRound: enabled, // Always true when enabled
            autoPickStatus: roomState.getAutoPickStatus(userId),
          });
        } catch (error) {
          console.error("❌ Error updating auto-pick settings:", error);
          socket.emit("error", {
            message: "Failed to update auto-pick settings",
          });
        }
      }
    );

    // Handle disconnect
    socket.on("disconnect", () => {
      for (const [drawId, roomState] of draftRooms.entries()) {
        roomState.participants.delete(socket.id);
      }
    });
  });
};

// Live draw checker for automatic status updates
export const startLiveDrawChecker = (io) => {
  setInterval(async () => {
    try {
      const now = new Date();
      const upcomingLotteries = await Lottery.find({
        lottery_status: "upcoming",
      });

      for (const lottery of upcomingLotteries) {
        const drawDateTime = new Date(
          `${lottery.drawDate}T${lottery.drawTime}`
        );

        if (now >= drawDateTime) {
          try {
            lottery.lottery_status = "live";
            await lottery.save();

            const roomState = getRoomState(lottery._id.toString());
            roomState.phase = "welcome";

            io.emit("statusUpdate", {
              lotteryId: lottery._id,
              newStatus: "live",
            });
          } catch (error) {
            console.error(
              `❌ Error updating lottery ${lottery._id} to live:`,
              error.message
            );
          }
        }
      }
    } catch (err) {
      console.error("[LiveDrawChecker] Error:", err);
    }
  }, 1000);
};

// Get performance metrics
export const getPerformanceMetrics = () => {
  const metrics = {
    activeRooms: draftRooms.size,
    cacheStats: dataPreloader.getCacheStats(),
    totalParticipants: 0,
    totalPicks: 0,
  };

  for (const roomState of draftRooms.values()) {
    metrics.totalParticipants += roomState.participants.size;
    metrics.totalPicks += roomState.pickHistoryManager.getTotalPicks();
  }

  return metrics;
};

// Cleanup function
export const cleanupLiveDraw = () => {
  for (const roomState of draftRooms.values()) {
    roomState.cleanup();
  }
  draftRooms.clear();
  dataPreloader.cleanup();
};
