// server/routes/history.js
import express from 'express';
import Url from '../models/url.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 🔒 GET /history - Get URL history for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const urls = await Url.find({ userId }).sort({ createdAt: -1 });

    res.json(urls);
  } catch (err) {
    console.error('❌ Error fetching user history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// 🔒 DELETE /history/:id - Delete a URL belonging to the user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await Url.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'URL not found or not authorized' });
    }

    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting URL:', err);
    res.status(500).json({ error: 'Failed to delete URL' });
  }
});

export default router;
