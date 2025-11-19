import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customers.js";

const app = express();
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cis_demo")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

app.listen(4000, () => console.log("Server running on port 4000"));
