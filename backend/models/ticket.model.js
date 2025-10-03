import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lottery: {
      lottery_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lottery",
        required: true,
      },
      set_name: {
        type: String,
        required: true,
      },
    },
    ticket_id: [
      {
        _id: false,
        ticket_id: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 50,
        },
      },
    ],
    ticket_price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
      default: "stripe",
    },
    payment_status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "paid",
    },
    address: {
      type: Object,
      required: true,
    },
    address_type: {
      type: String,
      enum: ["billing", "shipping"],
      required: true,
    },
    shipping_fee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    payment_reference: {
      type: String,
    },
    session_id: {
      type: String,
      default: null,
    },
    purchase_id: {
      type: String,
      required: true,
      unique: true,
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
  {
    timestamps: true,
  }
);

// Index for efficient queries
ticketSchema.index({ user_id: 1, "lottery.lottery_id": 1 });
ticketSchema.index({ payment_status: 1 });

// Virtual for getting total number of tickets
ticketSchema.virtual("ticket_count").get(function () {
  return this.ticket_id.length;
});

// Ensure virtuals are included in JSON output
ticketSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Ticket", ticketSchema);
