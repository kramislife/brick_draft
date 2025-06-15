import mongoose from "mongoose";

const lotteryRoundsSchema = new mongoose.Schema(
  {
    round_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lottery_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lottery",
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    won_item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LegoItem",
      default: null,
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
  {
    timestamps: true,
  }
);
const LotteryRound = mongoose.model("LotteryRound", lotteryRoundsSchema);
export default LotteryRound;
