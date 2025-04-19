import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDatabase() {
  console.log("Connecting to database...");

  if (!MONGODB_URI) {
    console.error("❌ MongoDB URI not found in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}
