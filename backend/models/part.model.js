import mongoose from "mongoose";

const PartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
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
      minlength: 2,
      maxlength: 50,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    total_value: {
      type: Number,
      required: true,
      min: 0,
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
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
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

// Pre-save middleware to calculate total_value
PartSchema.pre("save", function (next) {
  this.total_value = this.price * this.quantity;
  next();
});

// Pre-update middleware to calculate total_value
PartSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.price && update.quantity) {
    update.total_value = update.price * update.quantity;
  }
  next();
});

// Ensure virtuals are included in JSON output
PartSchema.set("toJSON", { virtuals: true });

const Part = mongoose.model("Part", PartSchema);
export default Part;
