import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";

// IMPORT ALL ROUTES
import lotteryItemRoutes from "./routes/lego_items.route.js";

// IMPORT MIDDLEWARE
import errorsMiddleware from "./middleware/errors.middleware.js";
//import cookieParser from "cookie-parser";

/*FRONTEND FILE PATH
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

*/

// INITIALIZE EXPRESS APP
const app = express();

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config({
  path: "backend/config/config.env",
});

// HANDLE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

// CONNECTING TO DATABASE
connectDatabase();

//REGISTER EXPRESS.JSON
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
//app.use(cookieParser());

// REGISTER ROUTES
app.use("/api/v1", lotteryItemRoutes);

// REGISTER MIDDLEWARE
app.use(errorsMiddleware);

// START THE SERVER
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// HANDLE UNHANDLED PROMISE REJECTION
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message || err);
  console.log("Shutting down the server due to unhandled promise rejection...");

  server.close(() => {
    process.exit(1); // Graceful shutdown
  });
});
