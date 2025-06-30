import express from 'express';
import Url from '../models/url.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 🔒 DELETE /url/:id - delete a URL by _id for logged-in user
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const url = await Url.findOne({ _id: id, userId });

    if (!url) {
      return res.status(404).json({ error: "URL not found or unauthorized" });
    }

    await url.deleteOne();
    res.json({ message: "URL deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Server error during delete" });
  }
});

export default router;
