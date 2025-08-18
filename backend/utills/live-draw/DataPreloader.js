import Lottery from "../../models/lottery.model.js";
import Ticket from "../../models/ticket.model.js";
import PriorityList from "../../models/priority_list.model.js";
import User from "../../models/user.model.js";
import MemoryCache from "./MemoryCache.js";

class DataPreloader {
  constructor() {
    this.lotteryCache = new MemoryCache();
    this.priorityListCache = new MemoryCache();
    this.userCache = new MemoryCache();

    // Track active drafts to prevent cache expiration during drafts
    this.activeDrafts = new Set();

    // Start periodic cleanup (every 10 minutes)
    this.startPeriodicCleanup();
  }

  // Pre-load all data needed for a draft
  async preloadDraftData(lotteryId) {
    console.log(`🔄 Preloading data for lottery: ${lotteryId}`);

    try {
      // Load lottery data with parts
      const lottery = await Lottery.findById(lotteryId)
        .populate("collection", "name")
        .populate({
          path: "parts.part",
          populate: { path: "color", select: "color_name hex_code" },
        })
        .lean();

      if (!lottery) {
        throw new Error("Lottery not found");
      }

      // Cache lottery data with dynamic TTL
      this.lotteryCache.set(
        `lottery:${lotteryId}`,
        lottery,
        this.getCacheTTL()
      );

      // Load tickets with user data (optional - might not exist yet for guests)
      let tickets = [];
      let userIds = [];

      try {
        const ticketData = await Ticket.find({
          "lottery.lottery_id": lotteryId,
        })
          .populate("user_id", "name email profile_picture")
          .sort({ createdAt: 1 })
          .lean();

        // Transform tickets to flat structure
        tickets = this.transformTickets(ticketData);

        // Pre-load priority lists for all users (only if there are tickets)
        if (tickets && tickets.length > 0) {
          userIds = [...new Set(tickets.map((t) => t.user_id))];
          console.log("📊 Preloading data for users:", {
            totalTickets: tickets.length,
            uniqueUsers: userIds.length,
            userIds: userIds.slice(0, 5), // Show first 5 for debugging
          });

          await this.preloadPriorityLists(lotteryId, userIds);
          await this.preloadUserData(userIds);

          // Verify all users are cached
          const cachedUsers = userIds.filter((userId) =>
            this.getUserData(userId)
          );
          console.log("✅ User caching verification:", {
            expected: userIds.length,
            cached: cachedUsers.length,
            missing: userIds.length - cachedUsers.length,
          });
        }
      } catch (ticketError) {
        console.warn(
          "⚠️ No tickets found for lottery (might be guest viewing):",
          ticketError.message
        );
        // Continue without tickets - this is fine for guests
      }

      console.log(
        `✅ Preloaded data: ${lottery.parts.length} parts, ${tickets.length} tickets, ${userIds.length} users`
      );

      return {
        lottery,
        tickets: tickets,
        userIds,
      };
    } catch (error) {
      console.error("❌ Error preloading draft data:", error);
      throw error;
    }
  }

  // Transform tickets to flat structure
  transformTickets(tickets) {
    const flatTickets = [];

    tickets.forEach((ticket) => {
      ticket.ticket_id.forEach((ticketIdObj) => {
        if (!ticketIdObj.ticket_id) return;

        flatTickets.push({
          ticket_id: ticketIdObj.ticket_id,
          user_id: ticket.user_id._id.toString(),
          user: {
            _id: ticket.user_id._id,
            name: ticket.user_id.name,
            email: ticket.user_id.email,
            profile_picture: ticket.user_id.profile_picture,
          },
          status: "waiting",
          queueNumber: ticketIdObj.draftPosition,
          purchaseId: ticket.purchase_id,
        });
      });
    });

    return flatTickets;
  }

  // Pre-load priority lists
  async preloadPriorityLists(lotteryId, userIds) {
    const priorityLists = await PriorityList.find({
      lottery: lotteryId,
      user: { $in: userIds },
    })
      .populate("priorityItems.item")
      .lean();

    priorityLists.forEach((priorityList) => {
      const key = `priority:${priorityList.user}:${lotteryId}`;
      this.priorityListCache.set(
        key,
        priorityList.priorityItems,
        this.getCacheTTL()
      );
    });
  }

  // Pre-load user data
  async preloadUserData(userIds) {
    try {
      const users = await User.find({
        _id: { $in: userIds },
      })
        .select("name email profile_picture")
        .lean();

      console.log("🔍 Preloading user data:", {
        userIds: userIds.length,
        foundUsers: users.length,
        users: users.map((u) => ({ _id: u._id, name: u.name })),
      });

      // Cache all found users
      users.forEach((user) => {
        const cacheKey = `user:${user._id}`;
        this.userCache.set(cacheKey, user, this.getCacheTTL());
        console.log("✅ Cached user:", { cacheKey, name: user.name });
      });

      // Log any missing users
      const foundUserIds = users.map((u) => u._id.toString());
      const missingUserIds = userIds.filter(
        (id) => !foundUserIds.includes(id.toString())
      );
      if (missingUserIds.length > 0) {
        console.warn("⚠️ Some users not found in database:", missingUserIds);
      }

      return users;
    } catch (error) {
      console.error("❌ Error preloading user data:", error);
      throw error;
    }
  }

  // Get cached lottery data
  getLotteryData(lotteryId) {
    return this.lotteryCache.get(`lottery:${lotteryId}`);
  }

  // Get cached priority list
  getPriorityList(userId, lotteryId) {
    return this.priorityListCache.get(`priority:${userId}:${lotteryId}`) || [];
  }

  // Get cached user data
  getUserData(userId) {
    if (!userId) {
      console.warn("⚠️ getUserData called with null/undefined userId");
      return null;
    }

    const cacheKey = `user:${userId}`;
    const userData = this.userCache.get(cacheKey);

    console.log("🔍 DataPreloader getUserData:", {
      userId,
      cacheKey,
      userData: userData ? { _id: userData._id, name: userData.name } : null,
      cacheSize: this.userCache.size(),
      cacheKeys: Array.from(this.userCache.cache.keys()).slice(0, 5), // Show first 5 keys for debugging
    });

    return userData;
  }

  // Clear cache for specific lottery
  clearLotteryCache(lotteryId) {
    this.lotteryCache.delete(`lottery:${lotteryId}`);

    // Clear related priority lists
    const keys = Array.from(this.priorityListCache.cache.keys());
    keys.forEach((key) => {
      if (key.includes(`:${lotteryId}`)) {
        this.priorityListCache.delete(key);
      }
    });
  }

  // Get cache statistics
  getCacheStats() {
    return {
      lotteryCacheSize: this.lotteryCache.size(),
      priorityListCacheSize: this.priorityListCache.size(),
      userCacheSize: this.userCache.size(),
    };
  }

  // Check if lottery data is fully loaded
  isLotteryDataLoaded(lotteryId) {
    const lotteryData = this.getLotteryData(lotteryId);
    return lotteryData && lotteryData.parts && lotteryData.parts.length > 0;
  }

  // Cleanup expired cache entries
  cleanup() {
    this.lotteryCache.cleanup();
    this.priorityListCache.cleanup();
    this.userCache.cleanup();
  }

  // Get user data with fallback to database
  async getUserDataWithFallback(userId) {
    if (!userId) {
      return null;
    }

    // Try cache first
    let userData = this.getUserData(userId);

    if (userData) {
      return userData;
    }

    // If not in cache, try to load from database
    try {
      console.warn("⚠️ User data not in cache, loading from database:", userId);
      const user = await User.findById(userId)
        .select("name email profile_picture")
        .lean();

      if (user) {
        // Cache for future use
        this.userCache.set(`user:${userId}`, user, this.getCacheTTL());
        console.log("✅ Loaded and cached user from database:", user.name);
        return user;
      }
    } catch (error) {
      console.error("❌ Failed to load user from database:", error.message);
    }

    return null;
  }

  // Warm up cache for specific users (useful for late joiners)
  async warmupUserCache(userIds) {
    if (!userIds || userIds.length === 0) {
      return;
    }

    console.log("🔥 Warming up user cache for:", userIds.length, "users");

    try {
      const users = await User.find({
        _id: { $in: userIds },
      })
        .select("name email profile_picture")
        .lean();

      let cachedCount = 0;
      users.forEach((user) => {
        const cacheKey = `user:${user._id}`;
        if (!this.userCache.get(cacheKey)) {
          this.userCache.set(cacheKey, user, this.getCacheTTL());
          cachedCount++;
        }
      });

      console.log(
        `✅ Cache warmup complete: ${cachedCount}/${users.length} users cached`
      );
    } catch (error) {
      console.error("❌ Error warming up user cache:", error);
    }
  }

  // Get appropriate TTL based on active drafts
  getCacheTTL() {
    // If there are active drafts, use longer TTL (2 hours)
    // Otherwise, use shorter TTL (30 minutes)
    return this.activeDrafts.size > 0 ? 7200000 : 1800000;
  }

  // Mark draft as active (prevents cache expiration)
  markDraftActive(lotteryId) {
    this.activeDrafts.add(lotteryId);
    console.log(
      `🎯 Draft ${lotteryId} marked as active. Active drafts: ${this.activeDrafts.size}`
    );
  }

  // Mark draft as inactive (allows normal cache expiration)
  markDraftInactive(lotteryId) {
    this.activeDrafts.delete(lotteryId);
    console.log(
      `🏁 Draft ${lotteryId} marked as inactive. Active drafts: ${this.activeDrafts.size}`
    );
  }

  // Start periodic cleanup and cache refresh
  startPeriodicCleanup() {
    // Regular cleanup every 10 minutes
    setInterval(() => {
      this.cleanup();
    }, 600000); // Every 10 minutes

    // Cache refresh for active drafts every 15 minutes
    setInterval(() => {
      this.activeDrafts.forEach((lotteryId) => {
        this.refreshActiveDraftCache(lotteryId);
      });
    }, 900000); // Every 15 minutes
  }

  // Enhanced cleanup that respects active drafts
  cleanup() {
    const beforeSize = {
      lottery: this.lotteryCache.size(),
      priority: this.priorityListCache.size(),
      user: this.userCache.size(),
    };

    this.lotteryCache.cleanup();
    this.priorityListCache.cleanup();
    this.userCache.cleanup();

    const afterSize = {
      lottery: this.lotteryCache.size(),
      priority: this.priorityListCache.size(),
      user: this.userCache.size(),
    };

    console.log("🧹 Cache cleanup completed:", {
      before: beforeSize,
      after: afterSize,
      activeDrafts: this.activeDrafts.size,
    });
  }

  // Refresh cache for active drafts (called periodically during long drafts)
  async refreshActiveDraftCache(lotteryId) {
    if (!this.activeDrafts.has(lotteryId)) {
      return; // Not an active draft
    }

    console.log(`🔄 Refreshing cache for active draft: ${lotteryId}`);

    try {
      // Refresh lottery data
      const lottery = await Lottery.findById(lotteryId)
        .populate("collection", "name")
        .populate({
          path: "parts.part",
          populate: { path: "color", select: "color_name hex_code" },
        })
        .lean();

      if (lottery) {
        this.lotteryCache.set(
          `lottery:${lotteryId}`,
          lottery,
          this.getCacheTTL()
        );
        console.log(`✅ Refreshed lottery cache for draft: ${lotteryId}`);
      }

      // Refresh user data for this lottery's tickets
      const tickets = await Ticket.find({
        "lottery.lottery_id": lotteryId,
      })
        .populate("user_id", "name email profile_picture")
        .lean();

      if (tickets.length > 0) {
        const userIds = [
          ...new Set(tickets.map((t) => t.user_id._id.toString())),
        ];
        await this.warmupUserCache(userIds);
        console.log(`✅ Refreshed user cache for draft: ${lotteryId}`);
      }
    } catch (error) {
      console.error(`❌ Error refreshing cache for draft ${lotteryId}:`, error);
    }
  }
}

export default DataPreloader;
