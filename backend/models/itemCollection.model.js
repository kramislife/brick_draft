import mongoose from "mongoose";

const itemCollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
    },
    key: {
      type: String,
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description can't exceed 500 characters"],
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        validate: {
          validator: function (value) {
            // Allow empty string or a valid URL
            if (value === "") return true;
            return /^https?:\/\/.*\.(jpg|jpeg|png|gif|svg)$/i.test(value);
          },
          message: "URL must be a valid image URL.",
        },
      },
    },
    /*
    isFeatured: {
      type: Boolean,
      default: false,
    },
    */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      immutable: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate key from name
itemCollectionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.key = this.name.trim().toLowerCase().replace(/\s+/g, "_");
  }
  next();
});

// Pre-update middleware to update key if name changes
itemCollectionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.key = update.name.trim().toLowerCase().replace(/\s+/g, "_");
  }
  next();
});

// Indexes
itemCollectionSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

itemCollectionSchema.index(
  { key: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const ItemCollection = mongoose.model("ItemCollection", itemCollectionSchema);

export default ItemCollection;
