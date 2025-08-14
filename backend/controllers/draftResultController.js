import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import DraftResult from "../models/draft_result.model.js";
import User from "../models/user.model.js";
import Part from "../models/part.model.js";

// ==================== GET ALL COMPLETED DRAFT RESULTS ========================
export const getAllCompletedDraftResults = catchAsyncErrors(
  async (req, res, next) => {
    const { page = 1, limit = 10, sortBy = "completed_at" } = req.query;

    // Find all completed draft results
    const draftResults = await DraftResult.find({ draft_status: "completed" })
      .populate("lottery.lottery_id", "title image collection")
      .populate("ticket_results.user_id", "name email profile_picture")
      .populate({
        path: "ticket_results.won_parts.part_id",
        populate: { path: "color", select: "color_name hex_code" },
      })
      .sort({ [sortBy]: -1 })
      .lean();

    // Group by lottery set
    const groupedResults = draftResults.reduce((acc, result) => {
      const lotteryId = result.lottery.lottery_id._id.toString();
      const lotteryName = result.lottery.set_name;

      if (!acc[lotteryId]) {
        acc[lotteryId] = {
          lottery: {
            id: lotteryId,
            name: lotteryName,
            title: result.lottery.lottery_id.title,
            image: result.lottery.lottery_id.image,
            collection: result.lottery.lottery_id.collection,
          },
          results: [],
        };
      }

      acc[lotteryId].results.push(result);
      return acc;
    }, {});

    // Convert to array and sort by most recent
    const categorizedResults = Object.values(groupedResults).map((group) => ({
      ...group,
      results: group.results.sort(
        (a, b) => new Date(b.completed_at) - new Date(a.completed_at)
      ),
    }));

    res.status(200).json({
      success: true,
      message: "Draft results retrieved successfully",
      categorizedResults,
      totalGroups: categorizedResults.length,
      totalResults: draftResults.length,
    });
  }
);

// ==================== GET DRAFT RESULT BY ID ========================
export const getDraftResultById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const draftResult = await DraftResult.findById(id)
    .populate("lottery.lottery_id", "title image collection")
    .populate("ticket_results.user_id", "name email profile_picture")
    .populate({
      path: "ticket_results.won_parts.part_id",
      populate: { path: "color", select: "color_name hex_code" },
    })
    .lean();

  if (!draftResult) {
    return next(new customErrorHandler("Draft result not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Draft result retrieved successfully",
    draftResult,
  });
});

// ==================== GET USER'S DRAFT RESULTS ========================
export const getUserDraftResults = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user_id;
  const { page = 1, limit = 10 } = req.query;

  // Find draft results where user participated
  const draftResults = await DraftResult.find({
    draft_status: "completed",
    "ticket_results.user_id": userId,
  })
    .populate("lottery.lottery_id", "title image collection")
    .populate("ticket_results.user_id", "name email profile_picture")
    .populate({
      path: "ticket_results.won_parts.part_id",
      populate: { path: "color", select: "color_name hex_code" },
    })
    .sort({ completed_at: -1 })
    .lean();

  // Filter to only show user's tickets
  const userResults = draftResults
    .map((result) => ({
      ...result,
      ticket_results: result.ticket_results.filter(
        (ticket) => ticket.user_id._id.toString() === userId
      ),
    }))
    .filter((result) => result.ticket_results.length > 0);

  // Group by lottery set
  const groupedResults = userResults.reduce((acc, result) => {
    const lotteryId = result.lottery.lottery_id._id.toString();
    const lotteryName = result.lottery.set_name;

    if (!acc[lotteryId]) {
      acc[lotteryId] = {
        lottery: {
          id: lotteryId,
          name: lotteryName,
          title: result.lottery.lottery_id.title,
          image: result.lottery.lottery_id.image,
          collection: result.lottery.lottery_id.collection,
        },
        results: [],
      };
    }

    acc[lotteryId].results.push(result);
    return acc;
  }, {});

  const categorizedResults = Object.values(groupedResults).map((group) => ({
    ...group,
    results: group.results.sort(
      (a, b) => new Date(b.completed_at) - new Date(a.completed_at)
    ),
  }));

  res.status(200).json({
    success: true,
    message: "User draft results retrieved successfully",
    categorizedResults,
    totalGroups: categorizedResults.length,
    totalResults: userResults.length,
  });
});
