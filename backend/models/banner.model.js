import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    banner_image: {
      public_id: {
        type: String,
        required: true,
      },
      image_url: {
        type: String,
        required: true,
      },
    },
    alt_text: {
      type: String,
      required: true,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
