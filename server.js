import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./backend/routes/userRoutes.js"; // Adjust path if needed
import eventRouter from "./backend/routes/eventRoutes.js"; // Adjust path if needed
import setupEventNotifications from "./backend/utils/scheduleNotification.js"; // Adjust path if needed
import dbCOnnect from "./backend/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/user", userRouter);
app.use("/event", eventRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Event Management System Backend is Running");
});

// Connect to database
dbCOnnect();

// Initialize event notifications
setupEventNotifications();

// Export app for Vercel
export default app;
