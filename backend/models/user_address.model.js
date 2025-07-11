import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Address must be associated with a user"],
    },
    name: {
      type: String,
      required: [true, "Address name is required"],
      trim: true,
    },
    contact_number: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    address_line1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true,
    },
    address_line2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    postal_code: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-z0-9\s\-.,\/]{3,20}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid postal code!`,
      },
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      immutable: true,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

addressSchema.index({ user: 1, is_default: 1 });
addressSchema.index({ user: 1, country: 1 });
addressSchema.index({ user: 1, name: 1 }, { unique: true });

addressSchema.pre("save", async function (next) {
  if (this.is_default) {
    await mongoose
      .model("Address")
      .updateMany({ user: this.user, is_default: true }, { is_default: false });
  }
  next();
});

const Address = mongoose.model("Address", addressSchema);
export default Address;