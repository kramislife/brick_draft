import mongoose from "mongoose";

const lotterySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    whyCollect: {
      type: [String],
      validate: [(arr) => arr.length <= 3, "Maximum 3 reasons allowed"],
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    marketPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    drawDate: {
      type: String,
      required: true,
      // Format: YYYY-MM-DD
    },
    drawTime: {
      type: String,
      required: true,
      // Format: HH:mm (24-hour)
    },
    totalSlots: {
      type: Number,
      required: true,
      min: 1,
    },
    pieces: {
      type: Number,
      required: true,
      min: 1,
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemCollection",
      required: true,
    },
    tag: {
      type: String,
      enum: ["featured", "best_seller", "new_arrival", "limited_edition"],
      required: true,
      lowercase: true,
    },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
    parts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part",
        required: true,
      },
    ],
    lotteryRounds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LotteryRound",
      },
    ],
    lottery_status: {
      type: String,
      required: true,
      enum: ["upcomming", "active", "completed", "cancelled"],
      default: "upcomming",
      lowercase: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lottery", lotterySchema);
