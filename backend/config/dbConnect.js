import mongoose from "mongoose";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

export const connectDatabase = () => {
  let DB_URI = "";

  DB_URI =
    process.env.NODE_ENV == "PRODUCTION"
      ? process.env.DB_PROD_URI
      : process.env.DB_DEV_URI;

  mongoose
    .connect(DB_URI)
    .then((con) => {
      console.log(
        `MongoDB database connected with host ${con?.connection?.host}`
      );
    })
    .catch((err) => {
      console.error(err);
    });
};
