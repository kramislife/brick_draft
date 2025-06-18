import mongoose from "mongoose";

const itemCollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    key: {
      type: String,
      unique: true,
    },
    popularityId: {
      type: String,
      unique: true,
      required: [true, "Popularity ID is required"],
      validate: {
        validator: function (value) {
          return /^[0-9]{3}$/.test(value);
        },
        message: "Popularity ID must be a 3-digit number (001-999)",
      },
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

// Pre-save middleware
itemCollectionSchema.pre("save", async function (next) {
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
    if (!this.key) {
      this.key = this.name.replace(/\s+/g, "_");
    }
  }

  if (this.popularityId) {
    this.popularityId = this.popularityId.toString().padStart(3, "0");
  }

  const existingCollection = await this.constructor
    .findOne({
      _id: { $ne: this._id },
      $or: [{ key: this.key }, { popularityId: this.popularityId }],
    })
    .collation({ locale: "en", strength: 2 });

  if (existingCollection) {
    if (existingCollection.popularityId === this.popularityId) {
      return next(
        new Error(
          `Popularity ID ${this.popularityId} is already in use. Please choose a different number.`
        )
      );
    }
    if (existingCollection.key === this.key) {
      return next(new Error("Collection with similar name already exists."));
    }
  }

  next();
});

// Pre-update middleware
itemCollectionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const docId = this.getQuery()._id;

  if (update.name) {
    update.name = update.name.trim().toLowerCase();
    if (!update.key) {
      update.key = update.name.replace(/\s+/g, "_");
    }
  }

  if (update.popularityId) {
    update.popularityId = update.popularityId.toString().padStart(3, "0");
  }

  const existingCollection = await mongoose
    .model("ItemCollection")
    .findOne({
      _id: { $ne: docId },
      $or: [{ key: update.key }, { popularityId: update.popularityId }],
    })
    .collation({ locale: "en", strength: 2 });

  if (existingCollection) {
    if (existingCollection.popularityId === update.popularityId) {
      return next(
        new Error(
          `Popularity ID ${update.popularityId} is already in use. Please choose a different number.`
        )
      );
    }
    if (existingCollection.key === update.key) {
      return next(new Error("Collection with similar name already exists."));
    }
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
