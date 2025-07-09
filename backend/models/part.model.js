import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    part_id: {
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
    category: {
      type: String,
      required: true,
      enum: ["part", "minifigure"],
      lowercase: true,
    },
    category_name: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: Number,
      min: 0,
      default: 0,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    item_image: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
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

// Ensure virtuals are included in JSON output
partSchema.set("toJSON", { virtuals: true });

const Part = mongoose.model("Part", partSchema);
export default Part;
