import mongoose from "mongoose";
import Part from "../models/part.model.js";
import legoData from "./data.js"; // Assuming this file contains the data to be seeded
import dotenv from "dotenv";

dotenv.config({ path: "./backend/config/config.env" }); // Load environment variables

const seedParts = async () => {
  try {
    await mongoose.connect(process.env.DB_DEV_URI);

    console.log("Connected to MongoDB for seeding...");

    // CLEAR EXISTING PARTS
    await Part.deleteMany();
    console.log("Existing parts cleared.");

    // INSERT NEW PARTS
    const parts = await Part.insertMany(legoData);
    console.log(`${parts.length} parts seeded successfully.`);
  } catch (error) {
    console.error("Error seeding parts:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

seedParts();
