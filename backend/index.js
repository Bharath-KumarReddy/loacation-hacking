import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://bharath:bharath@cluster0.yjcqvru.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema
const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  timestamp: String,
});

const Location = mongoose.model("Location", locationSchema);

// Endpoint
app.post("/api/location", async (req, res) => {
  try {
    // ⭐ PRINT THE LOCATION DATA RECEIVED FROM FRONTEND
    console.log("📍 Received Location Data:");
    console.log(req.body);

    const doc = new Location(req.body);
    await doc.save();

    res.json({ message: "Location saved" });
  } catch (err) {
    console.error("❌ Error saving location:", err);
    res.status(500).json({ error: "Database save error" });
  }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
