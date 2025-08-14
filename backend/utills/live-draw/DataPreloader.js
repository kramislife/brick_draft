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

      // Cache lottery data
      this.lotteryCache.set(`lottery:${lotteryId}`, lottery, 1800000); // 30 minutes

      // Load tickets with user data
      const tickets = await Ticket.find({
        "lottery.lottery_id": lotteryId,
      })
        .populate("user_id", "name email profile_picture")
        .sort({ createdAt: 1 })
        .lean();

      // Transform tickets to flat structure
      const flatTickets = this.transformTickets(tickets);

      // Pre-load priority lists for all users
      const userIds = [...new Set(flatTickets.map((t) => t.user_id))];
      await this.preloadPriorityLists(lotteryId, userIds);

      // Pre-load user data
      await this.preloadUserData(userIds);

      console.log(
        `✅ Preloaded data: ${lottery.parts.length} parts, ${flatTickets.length} tickets, ${userIds.length} users`
      );

      return {
        lottery,
        tickets: flatTickets,
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
      this.priorityListCache.set(key, priorityList.priorityItems, 1800000); // 30 minutes
    });
  }

  // Pre-load user data
  async preloadUserData(userIds) {
    const users = await User.find({
      _id: { $in: userIds },
    })
      .select("name email profile_picture")
      .lean();

    console.log("🔍 Preloading user data:", {
      userIds,
      foundUsers: users.length,
      users: users.map((u) => ({ _id: u._id, name: u.name })),
    });

    users.forEach((user) => {
      const cacheKey = `user:${user._id}`;
      this.userCache.set(cacheKey, user, 1800000); // 30 minutes
      console.log("✅ Cached user:", { cacheKey, name: user.name });
    });
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
    const userData = this.userCache.get(`user:${userId}`);
    console.log("🔍 DataPreloader getUserData:", {
      userId,
      cacheKey: `user:${userId}`,
      userData,
      cacheSize: this.userCache.size(),
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
}

export default DataPreloader;
