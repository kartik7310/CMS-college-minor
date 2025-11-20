import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customers.js";
import connectDB from "./utils/db.js";

const app = express();
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

// DB CONNECT
await connectDB();


app.listen(4000, () => console.log("Server running on port 4000"));
