// server/routes/shorten.js
import express from 'express';
import { nanoid } from 'nanoid';
import { authenticateToken } from '../middleware/auth.js';
import { createUrl } from '../models/url.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  try {
    const shortCode = nanoid(6);
    const userId = req.userId;

    const url = await createUrl(originalUrl, shortCode, userId);

    res.status(201).json({ shortUrl: `http://localhost:5000/s/${url.shortCode}` });
  } catch (err) {
    console.error('❌ Shorten error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
