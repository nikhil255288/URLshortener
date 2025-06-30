import express from 'express';
import Url from '../models/url.js';

const router = express.Router();

// GET /s/:code → Redirect to original URL and increment clicks
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOneAndUpdate(
      { shortCode: code },
      { $inc: { clicks: 1 } }, // Increment click count
      { new: true }            // Return updated document
    );

    if (!url) {
      return res.status(404).send('❌ Short URL not found');
    }

    // Redirect user to the original URL
    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error('🔴 Redirect error:', error.message);
    return res.status(500).send('❌ Server error during redirection');
  }
});

export default router;
