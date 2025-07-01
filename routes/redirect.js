import express from 'express';
import Url from '../models/url.js';

const router = express.Router();

// GET /s/:code → Redirect to original URL and increment clicks
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    // Ensure code is trimmed/lowercased for consistency
    const url = await Url.findOneAndUpdate(
      { shortCode: code.trim() },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) {
      return res.status(404).send(`
        <h2 style="font-family: sans-serif; color: red; text-align: center;">
          ❌ Short URL not found
        </h2>
      `);
    }

    // ✅ Add fallback to include http(s) in case missing
    const redirectUrl = url.originalUrl.startsWith("http")
      ? url.originalUrl
      : `https://${url.originalUrl}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('🔴 Redirect error:', error.message);
    return res.status(500).send(`
      <h2 style="font-family: sans-serif; color: red; text-align: center;">
        ❌ Server error during redirection
      </h2>
    `);
  }
});

export default router;
