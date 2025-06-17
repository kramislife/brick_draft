import mongoose from "mongoose";
import { generate_id } from "../utills/generate_id.js";

const LegoItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    item_id: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },
    item_images: {
      type: [
        {
          public_id: { type: String, required: true, trim: true },
          url: { type: String, required: true, trim: true },
        },
      ],
      validate: {
        validator: (val) => Array.isArray(val) && val.length > 0,
        message: "At least one image is required.",
      },
    },
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
    },
    item_collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-generate item_id before saving
LegoItemSchema.pre("save", function (next) {
  this.category = this.category?.toLowerCase();

  if (!this.item_id) {
    const prefix = this.category === "minifigure" ? "MINIFIG" : "PART";
    this.item_id = generate_id(prefix);
  }
  next();
});

const LegoItem = mongoose.model("LegoItem", LegoItemSchema);
export default LegoItem;
