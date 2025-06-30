import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/user.model.js";
import customErrorHandler from "../utills/custom_error_handler.js";
import crypto from "crypto";
import {
  clearCookies,
  generateAccessToken,
  generateCookies,
} from "../utills/generateTokens.js";

import Address from "../models/user_address.model.js";
import sendEmail from "../utills/sendEmail.js";
import { getResetPasswordTemplate } from "../utills/Emails/ResetPasswordTemplate.js";
import { getVerificationEmailTemplate } from "../utills/Emails/VerificationEmailTemplate.js";
import { deleteImage, uploadImage } from "../utills/cloudinary.js";
import { ContactFormTemplate } from "../utills/Emails/ContactFormTemplate.js";

// --------------------------------------- REGISTER USER --------------------------------------- //
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  //1. TAKE USER DATA FROM REQUEST BODY
  const { name, username, email, password, contact_number } = req.body;

  if (!name || !username || !email || !password || !contact_number) {
    return next(
      new customErrorHandler("Please fill in all required fields", 400)
    );
  }

  //2. CHECK IF THE USER WITH SAME EMAIL OR USERNAME ALREADY EXISTS
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    if (user.email === email) {
      return next(new customErrorHandler("Email already registered", 400));
    }
    if (user.username === username) {
      return next(new customErrorHandler("Username already taken", 400));
    }
  }

  //3. CREATE A NEW USER
  const new_user = await User({
    name,
    username,
    email,
    password,
    contact_number,
  });

  // 4. GET THE VERIFICATION TOKEN
  const token = new_user.generateVerificationToken();

  //5. SAVE THE USER TO DATABASE
  await new_user.save();

  // 6. CREATE VERIFICATION LINK
  const verificationLink = `${process.env.FRONTEND_URL}/verify_user/${token}`;

  // 7. SEND THE VERIFICATION LINK TO THE USER'S EMAIL
  try {
    await sendEmail({
      email: new_user.email,
      subject: `Verify Your Email | ${process.env.SMTP_FROM_NAME}`,
      message: getVerificationEmailTemplate(new_user, verificationLink),
    });
  } catch (emailError) {
    // If email fails, still create the user but inform them
    console.error("Email sending failed:", emailError);
    return next(
      new customErrorHandler(
        "Account created but verification email failed to send. Please contact support.",
        500
      )
    );
  }

  // 8. SEND RESPONSE TO THE USER
  res.status(201).json({
    status: "success",
    message:
      "Registration successful! Please check your email for verification.",  
    new_user,
  });
});

// ----------------------------------------------- VERIFY USER ----------------------------------------------- //
export const verifyUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.params.token;

  const user = await User.findOneAndUpdate(
    {
      verification_token: token,
      verification_token_expiry: { $gt: Date.now() },
    },
    {
      $set: {
        is_verified: true,
        verification_token: undefined,
        verification_token_expiry: undefined,
      },
    },
    { new: true }
  );

  // If no user found or token expired
  if (!user) {
    const userWithToken = await User.findOne({ verification_token: token });

    if (!userWithToken) {
      return next(
        new customErrorHandler(
          "Invalid verification token. Please check your email for the correct verification link.",
          403
        )
      );
    }

    // Token expired case - Don't automatically send new email
    if (userWithToken.verification_token_expiry < Date.now()) {
      return next(
        new customErrorHandler(
          "Verification link has expired. Please request a new verification link from the login page.",
          400
        )
      );
    }
  }

  res.status(200).json({
    status: "success",
    message: "Email verification successful!",
    description:
      "Your email has been successfully verified. You can now log in to your account.",
  });
});

// --------------------------------------- LOGIN USER --------------------------------------- //

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email_username, password } = req.body;

  // 1. VALIDATE INPUT
  if (!email_username || !password) {
    return next(new ErrorHandler("Invalid Login Credentials", 400));
  }

  // 2. CHECK IF USER EXISTS USING EMAIL OR USERNAME
  const user = await User.findOne({
    $or: [{ email: email_username }, { username: email_username }],
  }).select("+password");

  // 3. IF USER DOES NOT EXIST
  if (!user) {
    return next(
      new customErrorHandler(
        "Account not found. Please check your credentials or register a new account.",
        404
      )
    );
  }

  // 4. IF PASSWORD DOES NOT MATCH
  if (!(await user.comparePassword(password))) {
    return next(
      new customErrorHandler(
        "Invalid credentials. Please try again.",
        401
      )
    );
  }

  // 5. CHECK IF USER IS SUSPENDED
  if (user.isSuspended) {
    return next(
      new customErrorHandler(
        "Your account has been suspended. Please contact support for assistance.",
        403
      )
    );
  }

  // 6. CHECK IF USER IS VERIFIED
  if (!user.is_verified) {
    return next(
      new customErrorHandler(
        "Please verify your email address before logging in. Check your inbox for the verification link.",
        401
      )
    );
  }

  // 7. UPDATE LAST LOGIN
  user.last_login = new Date();

  // 8. GENERATE ACCESS TOKEN
  const payload = { user_id: user._id, role: user.role };
  const accessToken = generateAccessToken(
    payload,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    process.env.JWT_ACCESS_TOKEN_EXPIRY
  );

  // 9. GENERATE REFRESH TOKEN
  const refreshToken = user.generateRefreshToken();

  // 10. SAVE USER IN DATABASE
  await user.save();

  // 11. SAVE ACCESS TOKEN IN COOKIE
  const maxAge = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY) * 60 * 60 * 1000;
  generateCookies(res, "accessToken", accessToken, maxAge);

  // 12. SAVE REFRESH TOKEN IN COOKIE
  const refreshMaxAge =
    parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY) * 24 * 60 * 60 * 1000;
  generateCookies(res, "refreshToken", refreshToken, refreshMaxAge);

  res.status(200).json({
    success: true,
    message: "Login successful!",
    description: `Welcome back, ${user.name}!`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      contact_number: user.contact_number,
      profile_picture: user.profile_picture,
      is_verified: user.is_verified,
      last_login: user.last_login,
      createdAt: user.createdAt,
    },
  });
  // console.log("User:", user);
});

// --------------------------------------------------------- LOGOUT USER -----------------------------------------------------------------

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }

  // 1. FIND USER WITH THE PROVIDED REFRESH TOKEN
  const user = await User.findOne({ refresh_token: refreshToken });

  if (user) {
    user.refresh_token = null;
    user.refresh_token_expiry = null;
    await user.save();
  }

  clearCookies(res, "accessToken");
  clearCookies(res, "refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// -------------------------------- GET CURRENT USER PROFILE ---------------------------------//

export const getCurrentUserProfile = catchAsyncErrors(
  async (req, res, next) => {
    const user_id = req?.user?.user_id;

    const user = await User.findById(user_id);

    if (user) {
      res.status(200).json({
        success: true,
        user,
      });
    }
  }
);

// -------------------------------------- UPDATE CURRENT USER DATA ------------------------------------------------- //
export const updateCurrentUserProfile = catchAsyncErrors(
  async (req, res, next) => {
    const user_id = req.user.user_id;
    const { contact_number, name } = req.body;

    const updateFields = {};

    // Validate phone number if provided
    if (contact_number) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(contact_number)) {
        return next(new customErrorHandler("Invalid phone number format", 400));
      }
      updateFields.contact_number = contact_number;
    }

    // Validate name if provided
    if (name) {
      if (name.trim().length < 3) {
        return next(
          new customErrorHandler("Name must be at least 3 characters long", 400)
        );
      }
      updateFields.name = name.trim();
    }

    const user = await User.findByIdAndUpdate(user_id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new customErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  }
);

// -------------------------------------------------- FORGOT PASSWORD --------------------------------------------------
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(
      new customErrorHandler("Please provide your email address", 400)
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new customErrorHandler(
        "No account found with this email address. Please check your email or register a new account.",
        404
      )
    );
  }

  // Generate reset password token
  const reset_password_token = User.generateResetPasswordToken();
  await user.save();

  // Create reset password URL
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset-password/${reset_password_token}`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery | ${process.env.SMTP_FROM_NAME}`,
      message: getResetPasswordTemplate(user, resetUrl),
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully!",
      description: `A password reset link has been sent to ${user.email}. Please check your inbox and follow the instructions to reset your password.`,
    });
  } catch (err) {
    user.reset_password_token = undefined;
    user.reset_password_token_expiry = undefined;
    await user.save();

    return next(
      new customErrorHandler(
        "Failed to send password reset email. Please try again later.",
        500
      )
    );
  }
});

// -------------------------------------- RESET PASSWORD -----------------------------------//
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = req.params.token;

  if (!resetPasswordToken) {
    return next(
      new customErrorHandler("Please provide a valid reset password token", 400)
    );
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  const user = await User.findOne({
    reset_password_token: hashedToken,
    reset_password_token_expiry: { $gt: Date.now() },
  });

  if (!user) {
    // Don't automatically generate new token and send email
    return next(
      new customErrorHandler(
        "Reset password link is invalid or has expired. Please request a new reset link.",
        400
      )
    );
  }

  // If passwords don't match
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new customErrorHandler(
        "Passwords do not match. Please make sure both passwords are identical.",
        400
      )
    );
  }

  // Update the password
  user.password = req.body.password;
  user.reset_password_token = undefined;
  user.reset_password_token_expiry = undefined;

  await user.save();

  // Send confirmation email
  try {
    await sendEmail({
      email: user.email,
      subject: `Password Reset Successful | ${process.env.SMTP_FROM_NAME}`,
      message: `
        <p>Hello ${user.username},</p>
        <p>Your password has been successfully reset. If this was not you, please contact support immediately at <a href="mailto:${process.env.SMTP_FROM_EMAIL}">${process.env.SMTP_FROM_EMAIL}</a></p>
      `,
    });
  } catch (error) {
    console.log("Error sending confirmation email:", error.message);
  }

  res.status(200).json({
    success: true,
    message: "Password reset successful!",
    description:
      "Your password has been successfully updated. You can now log in with your new password.",
  });
});

// -------------------------- UPDATE CURRENT USER PASSWORD -----------------------------//

export const updateCurrentUserPassword = catchAsyncErrors(
  async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user_id = req?.user?.user_id;

    // 1. Check if all required fields are provided
    if (!oldPassword || !newPassword || !confirmPassword) {
      return next(new customErrorHandler("Please fill in all fields", 400));
    }

    // 2. Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return next(new customErrorHandler("Passwords do not match", 400));
    }

    // 3. Get the user with password field
    const user = await User.findById(user_id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // 4. Verify the old password is correct
    const isOldPasswordCorrect = await user.comparePassword(oldPassword);

    if (!isOldPasswordCorrect) {
      return next(
        new customErrorHandler("Invalid Credentials. Please try again", 400)
      );
    }

    // 5. Check that new password is different from old password
    const isNewPasswordSameAsOld = await user.comparePassword(newPassword);

    if (isNewPasswordSameAsOld) {
      return next(
        new customErrorHandler(
          "New password cannot be the same as the current password",
          400
        )
      );
    }

    // 6. Update the password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  }
);

// ------------------------------------ CREATE USER ADDRESS ------------------------------------------------- //

export const createAddress = catchAsyncErrors(async (req, res, next) => {
  const user_id = req.user.user_id;
  //console.log("User ID:", user_id);

  if (!user_id) {
    return next(new customErrorHandler("User not found", 404));
  }

  const user = await User.findById(user_id);
  if (!user) {
    return next(new customErrorHandler("User not found", 404));
  }

  if (!user.is_verified) {
    return next(
      new customErrorHandler(
        "Your account is not verified. User must be verified to add an address",
        401
      )
    );
  }

  const {
    name,
    contact_number,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    country_code,
    is_default,
  } = req.body;

  // ENSURE REQUIRED FIELDS ARE PRESENT
  if (
    name === "" ||
    contact_number === "" ||
    address_line1 === "" ||
    city === "" ||
    postal_code === "" ||
    country === ""
  ) {
    return next(
      new customErrorHandler("Please fill in all the required fields", 400)
    );
  }

  if (is_default) {
    await Address.updateMany(
      { user_id, is_default: true },
      { is_default: false }
    );
  }

  const address = await Address.create({
    user: user_id,
    name,
    contact_number,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    country_code,
    is_default,
  });

  // RETURN THE CREATED ADDRESS TO THE CLIENT
  res.status(201).json({
    success: true,
    message: "Address created successfully",
    address,
  });
});

// ------------------------ UPDATE A USER ADDRESS FOR A SINGLE USER ----------------------------------------

export const updateAddress = catchAsyncErrors(async (req, res, next) => {
  const user_id = req.user.user_id;

  const address_id = req.params.id;

  if (!user_id) {
    return next(
      new customErrorHandler(
        " User must be logged in to update an address",
        401
      )
    );
  }

  // console.log("ADDRESS ID:", address_id);
  const address = await Address.findById(address_id);

  if (!address || address.is_deleted) {
    return next(
      new customErrorHandler("Address not found or has been deleted", 404)
    );
  }

  if (address.user.toString() !== user_id.toString()) {
    return next(
      new customErrorHandler(
        "You are not authorized to update this address",
        403
      )
    );
  }

  const {
    name,
    contact_number,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    country_code,
    is_default,
  } = req.body;

  if (!name || !contact_number || !address_line1 || !city || !country) {
    return next(
      new customErrorHandler("Please provide all required fields", 400)
    );
  }

  const existingAddress = await Address.findOne({ user: user_id, name });

  if (
    existingAddress &&
    existingAddress._id.toString() !== address_id.toString()
  ) {
    return next(
      new customErrorHandler("Address with this name already exists", 400)
    );
  }

  if (is_default) {
    await Address.updateMany(
      {
        user: user_id,
        is_default: true,
      },
      { is_default: false }
    );
  }

  address.name = name;
  address.contact_number = contact_number;
  address.address_line1 = address_line1;
  address.address_line2 = address_line2;
  address.city = city;
  address.state = state;
  address.postal_code = postal_code;
  address.country = country;
  address.country_code = country_code;
  address.is_default = is_default || false;
  address.updated_by = user_id;

  await address.save();

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address,
  });
});

// --------------------------------------- GET ALL ADDRESSES FOR A USER  -----------------------------------
export const getAllAddresses = catchAsyncErrors(async (req, res, next) => {
  const user_id = req.user.user_id;

  if (!user_id) {
    return next(new customErrorHandler("You are not authorized ", 401));
  }

  const addresses = await Address.find({
    user: user_id,
    is_deleted: false,
  }).sort({ is_default: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    message: `${addresses.length} Addresses retrieved successfully`,
    addresses,
  });
});

// ---------- GET AN ADDRESS FOR A SINGLE USER  ---------------------------------------------

export const getSingleAddress = catchAsyncErrors(async (req, res, next) => {
  const user_id = req.user.user_id;
  const address_id = req.params.id;

  if (!user_id) {
    return next(new customErrorHandler("You are not authorized ", 401));
  }

  const address = await Address.findById(address_id);

  if (!address || address.user.toString() !== user_id.toString()) {
    return next(
      new customErrorHandler("Address not found or you are not authorized", 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Address retrieved successfully",
    address,
  });
});

// ---------- DELETE AN ADDRESS FOR A SINGLE USER  ---------------------------------------------

export const deleteAddress = catchAsyncErrors(async (req, res, next) => {
  const user_id = req.user.user_id;
  const address_id = req.params.id;

  if (!user_id) {
    return next(
      new customErrorHandler(
        "You are not authorized to access this resource",
        401
      )
    );
  }

  const address = await Address.findById(address_id);

  if (!address) {
    return next(new customErrorHandler("Address not found", 404));
  }

  if (address.user.toString() !== user_id.toString()) {
    return next(
      new customErrorHandler(
        "You are not authorized to delete this address",
        401
      )
    );
  }

  await address.deleteOne();

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

export const updateProfilePicture = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.user_id);

  if (!user) {
    return next(new customErrorHandler("User not found", 404));
  }

  // Delete old profile picture if it exists
  if (user.profile_picture?.public_id) {
    await deleteImage(user.profile_picture.public_id);
  }

  // Upload new profile picture
  const result = await uploadImage(req.body.avatar, "brick_draft/avatars");

  user.profile_picture = {
    public_id: result.public_id,
    url: result.url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    user,
  });
});

// ------------------------------------ CONTACT US ------------------------------------
export const contactUs = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message, subject } = req.body;

  if (!name || !email || !message) {
    return next(new customErrorHandler("Please fill in all fields", 400));
  }

  // Validate email format
  if (!/\S+@\S+\.\S+/.test(email)) {
    return next(
      new customErrorHandler("Please enter a valid email address", 400)
    );
  }

  try {
    // Send email to admin with custom subject if provided
    await sendEmail({
      email: process.env.SMTP_USER,
      subject: subject ? subject : `Contact Form Submission`,
      message: ContactFormTemplate({ name, email, message, subject }),
    });

    // Send confirmation email to user
    await sendEmail({
      email: email,
      subject: "Thank you for Contacting World of Minifigs",
      message: `
          <p>Hello ${name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>World of Minifigs Team</p>      
      `,
    });

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    return next(
      new customErrorHandler(
        "Failed to send message. Please try again later.",
        500
      )
    );
  }
});
