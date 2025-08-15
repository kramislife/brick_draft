import PickHistoryManager from "./PickHistoryManager.js";

class OptimizedRoomState {
  constructor(drawId) {
    this.drawId = drawId;
    this.phase = "welcome"; // welcome, lobby, countdown, playroom, completed
    this.tickets = [];
    this.countdown = 0;
    this.countdownInterval = null;
    this.draftCountdown = 15;
    this.draftCountdownInterval = null;
    this.isShuffling = false;
    this.participants = new Set();
    this.autoPickSettings = new Map(); // userId -> boolean (current round)
    this.nextRoundAutoPick = new Map(); // userId -> boolean (next round)

    // Draft state
    this.currentRound = 1;
    this.currentPick = 1;
    this.currentDrafter = null;

    // Optimized data structures
    this.pickHistoryManager = new PickHistoryManager();
    this.availableParts = new Map(); // partId -> partData
    this.userPriorityMaps = new Map(); // userId -> Map(partId -> priority)
    this.lotteryData = null;

    // Performance tracking
    this.metrics = {
      queryCount: 0,
      pickLatency: 0,
      lastPickTime: 0,
    };
  }

  // Lottery data management
  setLotteryData(lottery) {
    this.lotteryData = lottery;
    this.initializeAvailableParts();
  }

  initializeAvailableParts() {
    if (!this.lotteryData?.parts) return;

    this.availableParts.clear();
    this.lotteryData.parts.forEach((lotteryPart) => {
      const partId = lotteryPart.part._id.toString();
      // Handle both Mongoose documents and plain objects
      const partData = lotteryPart.part.toObject
        ? lotteryPart.part.toObject()
        : lotteryPart.part;
      this.availableParts.set(partId, {
        ...partData,
        total_value: lotteryPart.total_value || 0,
        price: lotteryPart.price || 0,
        quantity: lotteryPart.quantity || 1,
      });
    });
  }

  // Priority list management
  setUserPriorityList(userId, priorityList) {
    const priorityMap = new Map();
    priorityList.forEach((item) => {
      if (item?.item?._id) {
        priorityMap.set(item.item._id.toString(), item.priority);
      }
    });
    this.userPriorityMaps.set(userId.toString(), priorityMap);

    console.log(`📋 Priority list set for user ${userId}:`, {
      priorityListLength: priorityList.length,
      priorityMapSize: priorityMap.size,
      items: Array.from(priorityMap.entries()).slice(0, 3), // Show first 3 items
    });
  }

  getUserPriorityMap(userId) {
    const priorityMap =
      this.userPriorityMaps.get(userId.toString()) || new Map();
    console.log(`📋 Getting priority map for user ${userId}:`, {
      hasPriorityMap: priorityMap.size > 0,
      priorityMapSize: priorityMap.size,
    });
    return priorityMap;
  }

  // Part availability
  isPartAvailable(partId) {
    return (
      this.availableParts.has(partId.toString()) &&
      !this.pickHistoryManager.isPartPicked(partId)
    );
  }

  getAvailableParts() {
    return Array.from(this.availableParts.values()).filter(
      (part) => !this.pickHistoryManager.isPartPicked(part._id)
    );
  }

  // Pick operations
  pickPart(partId, userData, pickMethod = "manual") {
    const partIdStr = partId.toString();
    const part = this.availableParts.get(partIdStr);

    if (!part || this.pickHistoryManager.isPartPicked(partIdStr)) {
      return false;
    }

    const pick = {
      user: userData,
      part: part,
      ticket_id: this.currentDrafter?.ticket_id,
      round_number: this.currentRound,
      pick_method: pickMethod,
      timestamp: new Date(),
    };

    this.pickHistoryManager.addPick(pick);
    this.availableParts.delete(partIdStr);

    // Update metrics
    this.metrics.lastPickTime = Date.now();

    return true;
  }

  // Draft progression
  nextPick() {
    this.currentPick++;
    if (this.currentPick > this.tickets.length) {
      this.currentRound++;
      this.currentPick = 1;

      // ✅ Activate next round auto-pick settings
      this.activateNextRoundAutoPick();
    }
  }

  // Ticket management
  updateTicketStatus(userId, status) {
    let updatedCount = 0;
    this.tickets.forEach((ticket) => {
      if (ticket.user_id === userId) {
        ticket.status = status;
        updatedCount++;
      }
    });
    return updatedCount;
  }

  areAllUsersReady() {
    const uniqueUsers = new Set(this.tickets.map((t) => t.user_id));
    const readyUsers = new Set(
      this.tickets.filter((t) => t.status === "ready").map((t) => t.user_id)
    );
    return this.tickets.length > 0 && uniqueUsers.size === readyUsers.size;
  }

  // Countdown management
  clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  clearDraftCountdown() {
    if (this.draftCountdownInterval) {
      clearInterval(this.draftCountdownInterval);
      this.draftCountdownInterval = null;
    }
  }

  // Auto-pick management
  setAutoPick(userId, enabled, forNextRound = false) {
    // Handle null/undefined userId (for guests)
    if (!userId) {
      console.warn("⚠️ Attempted to set auto-pick for null/undefined userId");
      return;
    }

    const userIdStr = userId.toString();

    if (forNextRound) {
      // Schedule for next round
      if (enabled) {
        this.nextRoundAutoPick.set(userIdStr, true);
        console.log(`🤖 Auto-pick scheduled for next round for user ${userId}`);
      } else {
        this.nextRoundAutoPick.delete(userIdStr);
        console.log(`✋ Auto-pick cancelled for next round for user ${userId}`);
      }
    } else {
      // Immediate auto-pick
      if (enabled) {
        this.autoPickSettings.set(userIdStr, true);
        console.log(`🤖 Auto-pick enabled immediately for user ${userId}`);
      } else {
        this.autoPickSettings.delete(userIdStr);
        console.log(`✋ Auto-pick disabled for user ${userId}`);
      }
    }
  }

  hasAutoPickEnabled(userId) {
    // Handle null/undefined userId (for guests)
    if (!userId) {
      return false;
    }

    return this.autoPickSettings.has(userId.toString());
  }

  hasNextRoundAutoPick(userId) {
    // Handle null/undefined userId (for guests)
    if (!userId) {
      return false;
    }

    return this.nextRoundAutoPick.has(userId.toString());
  }

  // Activate next round auto-pick settings
  activateNextRoundAutoPick() {
    console.log("🔄 Activating next round auto-pick settings...");

    for (const [userId, enabled] of this.nextRoundAutoPick.entries()) {
      if (enabled) {
        this.autoPickSettings.set(userId, true);
        console.log(`🤖 Auto-pick activated for user ${userId} in new round`);
      }
    }

    // Clear next round settings
    this.nextRoundAutoPick.clear();
  }

  // Get auto-pick status for a user
  getAutoPickStatus(userId) {
    // Handle null/undefined userId (for guests)
    if (!userId) {
      return {
        currentRound: false,
        nextRound: false,
      };
    }

    const userIdStr = userId.toString();
    return {
      currentRound: this.autoPickSettings.has(userIdStr),
      nextRound: this.nextRoundAutoPick.has(userIdStr),
    };
  }

  // Performance metrics
  getMetrics() {
    return {
      ...this.metrics,
      totalPicks: this.pickHistoryManager.getTotalPicks(),
      availableParts: this.availableParts.size,
      participants: this.participants.size,
      autoPickUsers: this.autoPickSettings.size,
    };
  }

  // Cleanup
  cleanup() {
    this.clearCountdown();
    this.clearDraftCountdown();
    this.pickHistoryManager.clear();
    this.availableParts.clear();
    this.userPriorityMaps.clear();
    this.participants.clear();
    this.autoPickSettings.clear();
  }
}

export default OptimizedRoomState;
