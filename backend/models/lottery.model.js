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
    auction_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part",
      },
    ],
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
      validate: {
        validator: function (value) {
          return !this.startDate || value > this.startDate;
        },
        message: "End date must be after start date.",
      },
    },
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
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lottery", lotterySchema);
