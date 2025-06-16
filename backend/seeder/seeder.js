import mongoose from "mongoose";
import LegoItem from "../models/lego_items.model.js";
import legoData from "./data.js"; // Assuming this file contains the data to be seeded
import dotenv from "dotenv";

dotenv.config({ path: "./backend/config/config.env" }); // Load environment variables

const seedItems = async () => {
  try {
    await mongoose.connect(process.env.DB_DEV_URI);

    console.log("Connected to MongoDB for seeding...");

    // CLEAR EXISTING ITEMS
    await LegoItem.deleteMany();
    console.log("Existing items cleared.");

    // INSERT NEW ITEMS
    const items = await LegoItem.insertMany(legoData);
    console.log(`${items.length} items seeded successfully.`);
  } catch (error) {
    console.error("Error seeding items:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

seedItems();
