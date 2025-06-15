import express from "express";
import dotenv from "dotenv";

// IMPORT ALL ROUTES
import lotteryItemRoutes from "./routes/lottery_items.route.js";

// IMPORT DATABASE CONNECTION
import { connectDatabase } from "./config/dbConnect.js";

// INITIALIZE EXPRESS APP
const app = express();

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config({
  path: "backend/config/config.env",
});

// CONNECTING TO DATABASE
connectDatabase();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REGISTER ROUTES
app.use("/api/v1", lotteryItemRoutes);

// START THE SERVER
app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
