import mongoose from "mongoose";

const itemCollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
      unique: true,
      lowercase: true, // Ensures 'My Collection' and 'my collection' are treated the same
    },
    description: {
      type: String,
      required: [true, "Collection description is required"],
      trim: true,
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
  { timestamps: true } // Adds createdAt and updatedAt automatically
);
const ItemCollection = mongoose.model("Collection", itemCollectionSchema);
export default ItemCollection;
