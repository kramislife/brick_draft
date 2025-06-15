import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lottery_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lottery",
      required: true,
      index: true,
    },
    ticket_id: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAddress",
      required: true,
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

// Unique ticket per user per lottery - adjust if business requires multiple tickets per user/lottery
ticketSchema.index({ userId: 1, lotteryId: 1 }, { unique: true });

export default mongoose.model("Ticket", ticketSchema);
