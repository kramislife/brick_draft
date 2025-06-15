import mongoose from "mongoose";

const LegoItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    item_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    item_images: [
      {
        public_id: {
          type: String,
          trim: true,
          required: true,
        },
        url: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ["part", "minifigure"],
      lowercase: true,
      index: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
      lowercase: true,
      index: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const LegoItem = mongoose.model("LegoItem", LegoItemSchema);

export default LegoItem;
