import mongoose from "mongoose";

const priorityListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lottery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lottery",
      required: true,
    },
    purchaseId: {
      type: String,
      required: true,
      index: true,
    },
    priorityItems: [
      {
        _id: false,
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Part",
          required: true,
        },
        priority: {
          type: Number,
          required: true,
        },
      },
    ],
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
priorityListSchema.index(
  { user: 1, lottery: 1, purchaseId: 1 },
  { unique: true }
);

export default mongoose.model("PriorityList", priorityListSchema);
