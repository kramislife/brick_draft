import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    color_name: {
      type: String,
      required: [true, "Color name is required"],
      trim: true,
      unique: true,
    },
    hex_code: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^#(?:[0-9a-f]{3}){1,2}$/,
        "Please provide a valid hex color code",
      ],
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

const Color = mongoose.model("Color", colorSchema);
export default Color;
