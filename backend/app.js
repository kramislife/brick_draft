import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";

// IMPORT ROUTES
import partRoutes from "./routes/part.route.js";
import itemCollectionRoutes from "./routes/item_collection.route.js";
import userAuthentication from "./routes/auth.route.js";
import colorRoutes from "./routes/color.route.js";
import lotteryRoutes from "./routes/lottery.route.js";
import paymentRoutes from "./routes/payment.route.js";
import priorityListRoutes from "./routes/priority_list.route.js";
import draftResultRoutes from "./routes/draftResult.route.js";
import liveDrawRoutes from "./routes/liveDraw.route.js";

// IMPORT MIDDLEWARE
import errorsMiddleware from "./middleware/errors.middleware.js";
import cookieParser from "cookie-parser";
import fs from "fs";

// FRONTEND FILE PATH SETUP
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import {
  startLiveDrawChecker,
  handleLiveDrawSockets,
} from "./controllers/liveDrawController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// INITIALIZE EXPRESS APP
const app = express();

// LOAD ENVIRONMENT VARIABLES
dotenv.config({
  path: "backend/config/config.env",
});

// HANDLE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log(`❌ Uncaught Exception: ${err}`);
  process.exit(1);
});

// CONNECT TO DATABASE
connectDatabase();

// PARSE JSON & COOKIES
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());

// REGISTER API ROUTES
app.use("/api/v1", partRoutes);
app.use("/api/v1", itemCollectionRoutes);
app.use("/api/v1", userAuthentication);
app.use("/api/v1", colorRoutes);
app.use("/api/v1", lotteryRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", priorityListRoutes);
app.use("/api/v1", draftResultRoutes);
app.use("/api/v1", liveDrawRoutes);

// ERROR MIDDLEWARE
app.use(errorsMiddleware);

// ✅ STATIC FILE SERVING FOR PRODUCTION
if (process.env.NODE_ENV === "PRODUCTION") {
  try {
    const distDir = path.join(__dirname, "../frontend/dist");
    const indexFile = path.resolve(distDir, "index.html");

    console.log("🔧 [STATIC SETUP] Production mode");
    console.log("📁 Static files directory:", distDir);
    console.log("📄 Index file path:", indexFile);

    if (!fs.existsSync(distDir)) {
      console.error("❌ dist directory NOT found:", distDir);
    } else if (!fs.existsSync(indexFile)) {
      console.error("❌ index.html NOT found:", indexFile);
    } else {
      console.log("✅ dist and index.html found.");
      app.use(express.static(distDir));
      console.log("🚀 Static middleware registered.");

      // ✅ Catch-all route (safe for Express 5) to support frontend routing like /verify_user/:token
      app.use((req, res, next) => {
        if (req.method === "GET" && !req.path.startsWith("/api/")) {
          console.log(`📨 Serving index.html for unmatched path: ${req.path}`);
          return res.sendFile(indexFile);
        }
        next(); // Let 404 middleware handle other cases
      });
    }
  } catch (error) {
    console.error("🔥 Error during static file setup:", error);
  }
}

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Make io globally available for other controllers
global.io = io;

// Make io available in app (optional, for other controllers)
app.set("io", io);

// Initialize Socket.IO handlers
handleLiveDrawSockets(io);

// START SERVER
server.listen(process.env.PORT, () => {
  console.log(
    `✅ Server running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
  // Start the live draw checker after server is up
  startLiveDrawChecker(io);
});

// HANDLE UNHANDLED PROMISE REJECTIONS
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
