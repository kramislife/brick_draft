class DraftAlgorithm {
  // Calculate current drafter based on snake draft pattern
  static calculateCurrentDrafter(tickets, currentRound, currentPick) {
    if (!tickets.length || currentRound < 1) {
      return null;
    }

    const sortedTickets = [...tickets].sort(
      (a, b) => a.queueNumber - b.queueNumber
    );
    const totalTickets = sortedTickets.length;

    // Snake draft pattern
    let currentIndex;
    if (currentRound % 2 === 1) {
      // Odd rounds: 1 → N (normal order)
      currentIndex = (currentPick - 1) % totalTickets;
    } else {
      // Even rounds: N → 1 (reverse order)
      currentIndex = totalTickets - 1 - ((currentPick - 1) % totalTickets);
    }

    const selectedTicket = sortedTickets[currentIndex];
    return selectedTicket?.user_id ? selectedTicket : null;
  }

  // Enhanced auto-pick algorithm with priority logic
  static performOptimizedAutoPick(roomState, currentDrafter) {
    if (!roomState || !currentDrafter?.user_id) {
      return null;
    }

    const userId = currentDrafter.user_id.toString();
    const priorityMap = roomState.getUserPriorityMap(userId);
    const availableParts = roomState.getAvailableParts();

    if (!availableParts.length) {
      return null;
    }

    console.log(`🤖 Auto-pick for user ${userId}:`, {
      priorityMapSize: priorityMap.size,
      availablePartsCount: availableParts.length,
    });

    // Step 1: Check priority list first
    if (priorityMap.size > 0) {
      console.log("🎯 Checking priority list...");

      // Get priority list items sorted by priority (highest first)
      const priorityItems = Array.from(priorityMap.entries())
        .sort((a, b) => a[1] - b[1]) // Sort by priority (lower number = higher priority)
        .map(([partId, priority]) => ({ partId, priority }));

      // Find the highest value available part from priority list
      let bestPriorityPart = null;
      let bestPriorityValue = -1;

      for (const { partId } of priorityItems) {
        const part = availableParts.find((p) => p._id.toString() === partId);

        if (part && !roomState.pickHistoryManager.isPartPicked(partId)) {
          const value = part.total_value || 0;
          if (value > bestPriorityValue) {
            bestPriorityValue = value;
            bestPriorityPart = part;
          }
        }
      }

      if (bestPriorityPart) {
        console.log(
          `✅ Selected from priority list: ${bestPriorityPart.name} (value: ${bestPriorityValue})`
        );
        return bestPriorityPart;
      } else {
        console.log(
          "⚠️ Priority list exists but no items available, moving to part pool"
        );
      }
    }

    // Step 2: Pick from part pool (highest value available)
    console.log("🎲 Picking from part pool...");

    let bestPart = null;
    let bestValue = -1;

    for (const part of availableParts) {
      const partId = part._id.toString();

      // Skip if already picked
      if (roomState.pickHistoryManager.isPartPicked(partId)) {
        continue;
      }

      const value = part.total_value || 0;
      if (value > bestValue) {
        bestValue = value;
        bestPart = part;
      }
    }

    if (bestPart) {
      console.log(
        `✅ Selected from part pool: ${bestPart.name} (value: ${bestValue})`
      );
    } else {
      console.log("❌ No available parts found");
    }

    return bestPart;
  }

  // Shuffle array efficiently
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Check if draft is complete
  static isDraftComplete(roomState) {
    if (!roomState.lotteryData?.parts) {
      return false;
    }

    const totalParts = roomState.lotteryData.parts.length;
    const totalPicks = roomState.pickHistoryManager.getTotalPicks();

    return totalPicks >= totalParts;
  }

  // Get next drafter efficiently
  static getNextDrafter(roomState) {
    roomState.nextPick();
    return this.calculateCurrentDrafter(
      roomState.tickets,
      roomState.currentRound,
      roomState.currentPick
    );
  }

  // Validate pick operation
  static validatePick(roomState, partId, userId) {
    // Check if it's the user's turn
    if (
      !roomState.currentDrafter ||
      roomState.currentDrafter.user_id.toString() !== userId.toString()
    ) {
      return { valid: false, reason: "Not your turn" };
    }

    // Check if draft is active
    if (roomState.phase !== "playroom") {
      return { valid: false, reason: "Draft not active" };
    }

    // Check if part is available
    if (!roomState.isPartAvailable(partId)) {
      return { valid: false, reason: "Part not available" };
    }

    return { valid: true };
  }
}

export default DraftAlgorithm;
