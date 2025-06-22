import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateCookies,
} from "../utills/generateTokens.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import customErrorHandler from "../utills/custom_error_handler.js";

// CHECKS IF USER IS AUTHENTICATED OR NOT

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  //

  // 1. GET ACCESS TOKEN & REFRESH TOKEN FROM THE COOKIE
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // 2. CHECK IF TOKEN ARE AVAILABLE AND VALID
  if (!accessToken && !refreshToken) {
    return next(
      new customErrorHandler(" Please login to access this resource", 401)
    );
  }

  // 3. VERIFY ACCESS TOKEN
  if (accessToken) {
    try {
      const decodedAccessToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET
      );

      req.user = decodedAccessToken;

      return next();
    } catch (error) {
      if (error.name !== "TokenExpiredError")
        return next(new customErrorHandler("Unauthroized User !! ", 401));
    }
  }

  // 4. HANDLE EXPIRED ACCESS TOKEN
  if (refreshToken) {
    // console.log("AUSER => IN REFRESH TOKEN");
    try {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET
      );

      // 5. VERIFY REFRESH TOKEN AGAINST THE DATABASE
      const user = await User.findById(decodedRefreshToken.user_id);

      if (!user) {
        return next(new customErrorHandler("Unauthorized user here", 401));
      }

      // 6. GENERATE NEW ACCESS TOKEN
      let maxAge = 1; // 1 hour

      const newAccessToken = generateAccessToken(
        {
          user_id: decodedRefreshToken.user_id,
          role: user.role,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        maxAge
      );

      generateCookies(
        res,
        "accessToken",
        newAccessToken,
        maxAge * 60 * 60 * 1000
      );

      req.user = { user_id: user._id, role: user.role };
      return next();
    } catch (error) {
      return next(new customErrorHandler("Unauthorized User!! ", 401));
    }
  }

  next(
    new customErrorHandler(
      "Unauthenticated User! Please try to log in again ",
      401
    )
  );
});

// AUTHORISE USER ROLES
export const isAuthorizedUser = (...roles) => {
  return (req, res, next) => {
    // 1. CHECK IF USER IS LOGGED IN

    if (!req.user) {
      return next(new customErrorHandler("Unauthorized : User not found", 401));
    }

    //2. CHECK IF USER ROLE IS IN THE LIST OF ROLES

    "REQ.user => ", req.user;

    if (!roles.includes(req.user.role)) {
      return next(
        new customErrorHandler(
          `Forbidden : ${req.user.role} is not authorized to access this resource`,
          403
        )
      );
    }
    next();
  };
};
