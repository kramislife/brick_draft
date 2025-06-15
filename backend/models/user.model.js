import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ErrorHandler from "../Utills/customErrorHandler.js";
import jwt from "jsonwebtoken";

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
      lowercase: true, // Automatically convert email to lowercase
      trim: true,
      immutable: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minLength: [3, "Username must be at least 3 characters long"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [
        6,
        "Password must be at least 6 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special (!@#$%^&*_).",
      ],
      select: false,
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_]).{6,}$/.test(
            v
          );
        },
        message: (props) =>
          "Password must be at least 6 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special (!@#$%^&*_).",
      },
    },
    profile_picture: {
      public_id: { type: String },
      url: { type: String },
    },
    contact_number: {
      type: String,
      required: [true, "Contact number is required"],
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    is_verified: {
      type: Boolean,
      default: false, // Default false, user is not verified until they confirm their email
    },
    role: {
      type: String,
      enum: ["superAdmin", "admin", "employee", "seller", "customer"],
      default: "customer", // Default role is customer
    },
    verification_token: {
      type: String,
    },
    verification_token_expiry: {
      type: Date,
    },
    reset_password_token: {
      type: String,
    },
    reset_password_token_expiry: {
      type: Date,
    },
    refresh_token: {
      type: String,
    },
    refresh_token_expiry: {
      type: Date,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    last_login: {
      type: Date,
      default: Date.now,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ------------------------------------ GENERATE VERIFICATION TOKEN ------------------------------------------
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.verification_token = token;
  this.verification_token_expiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

  return token;
};

// ------------------------------------ GENERATE REFRESH TOKEN ------------------------------------------
userSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    {
      user_id: this._id,
      role: this.role,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRY}d`,
    }
  );

  this.refresh_token = token;
  this.refresh_token_expiry = new Date(
    Date.now() + process.env.JWT_REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000
  ); // 7 days from now

  return token;
};

// ------------------------------------------- ENCRYPT PASSWORD BEFORE SAVING ---------------------------------------------
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    return next(err);
  }
});

// ---------------------------------- COMPARE PASSWORD -------------------------------------------------

userSchema.methods.comparePassword = async function (user_password) {
  try {
    const isMatch = await bcrypt.compare(user_password, this.password);
    return isMatch;
  } catch (err) {
    return new ErrorHandler(err, 500);
  }
};

// ----------------------------------- GENERATE RESET PASSWORD TOKEN ---------------------------------------------------

userSchema.methods.generateResetPasswordToken = function () {
  const resetPasswordToken = crypto.randomBytes(64).toString("hex");

  this.reset_password_token = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  this.reset_password_token_expiry = new Date(
    Date.now() + process.env.PASSWORD_RESET_EXPIRY * 60 * 1000
  ); // 30 minutes from now


  return resetPasswordToken;
};

// ---------------------------------- EXPORT USER MODEL -------------------------------------------------

const User = mongoose.model("User", userSchema);
export default User;

userSchema.index({ role: 1, createdAt: 1 });
userSchema.index({ role: 1, _id: 1 });

