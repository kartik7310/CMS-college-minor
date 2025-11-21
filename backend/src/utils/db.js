import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your_db_name";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // fail fast
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    // optionally: process.exit(1);
  }
}
