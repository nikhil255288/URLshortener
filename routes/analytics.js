// server/routes/analytics.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Url from '../models/url.js';

const router = express.Router();

// 🔒 GET /analytics?startDate=&endDate=&limit=
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, limit } = req.query;

    const filter = { userId };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Total URLs filtered by date range
    const totalUrls = await Url.countDocuments(filter);

    // Total clicks filtered by date range
    const totalClicksAgg = await Url.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$clicks" } } },
    ]);
    const totalClicks = totalClicksAgg[0]?.total || 0;

    // Top links (filtered + sorted)
    const topLinks = await Url.find(filter)
      .sort({ clicks: -1 })
      .limit(parseInt(limit) || 5)
      .select('originalUrl shortCode clicks createdAt');

    res.json({
      totalUrls,
      totalClicks,
      topLinks,
    });
  } catch (err) {
    console.error("❌ Analytics error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
