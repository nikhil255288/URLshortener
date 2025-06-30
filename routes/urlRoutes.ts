import express from "express";
import Url from "../models/url";
import { generateShortCode } from "../utils/generateShortCode";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/shorten", authenticateToken, async (req, res) => {
  const { originalUrl } = req.body;
  const userId = req.user?.id;

  if (!originalUrl || !userId) {
    return res.status(400).json({ error: "Missing URL or user." });
  }

  try {
    const shortCode = generateShortCode();

    const newUrl = new Url({
      originalUrl,
      shortCode,
      userId,
      clicks: 0,
    });

    await newUrl.save();

    res.json({
      shortUrl: `http://localhost:5000/s/${shortCode}`,
      shortCode,
    });
  } catch (err) {
    console.error("Shorten error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
