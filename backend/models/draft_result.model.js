import mongoose from "mongoose";

const draftResultsSchema = new mongoose.Schema(
  {
    // ✅ LOTTERY ARRAY (like ticket.model.js structure)
    lottery: {
      lottery_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lottery",
        required: true,
        index: true,
      },
      set_name: {
        type: String,
        required: true,
      },
    },

    // ✅ DRAFT METADATA
    draft_status: {
      type: String,
      enum: ["in_progress", "completed", "cancelled"],
      default: "in_progress",
    },
    started_at: { type: Date, default: Date.now },
    completed_at: { type: Date },
    total_rounds: { type: Number, default: 0 },

    // ✅ TICKET RESULTS ARRAY
    ticket_results: [
      {
        ticket_id: { type: String, required: true }, // "TKT-123-456-789"
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        queue_number: { type: Number, required: true }, // Draft position

        // ✅ WINNING PARTS ARRAY (simplified)
        won_parts: [
          {
            part_id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Part",
              required: true,
            },
            item_id: {
              type: String,
              required: false, // Fallback for parts without part_id
            },
            round_number: { type: Number, required: true }, // Which round this was picked
            pick_time: { type: Date, default: Date.now },
          },
        ],

        // ✅ TICKET SUMMARY (simplified)
        total_parts_won: { type: Number, default: 0 },
        total_value: { type: Number, default: 0 }, // Total value for all parts
      },
    ],

    // ✅ DRAFT STATISTICS (simplified)
    draft_stats: {
      total_participants: { type: Number, default: 0 },
      total_tickets: { type: Number, default: 0 },
      total_parts_distributed: { type: Number, default: 0 },
      total_value_distributed: { type: Number, default: 0 },
      highest_value_ticket: { type: Number, default: 0 },
      lowest_value_ticket: { type: Number, default: 0 },
    },

    // ✅ ADMIN METADATA
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Indexes for performance
draftResultsSchema.index({ "lottery.lottery_id": 1 });
draftResultsSchema.index({ "ticket_results.user_id": 1 });
draftResultsSchema.index({ "ticket_results.ticket_id": 1 });
draftResultsSchema.index({ draft_status: 1 });

export default mongoose.model("DraftResult", draftResultsSchema);
