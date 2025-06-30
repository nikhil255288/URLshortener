// server/models/url.js
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // ✅ Now required
  },
});

const Url = mongoose.models.Url || mongoose.model('Url', urlSchema);

export async function createUrl(originalUrl, shortCode, userId) {
  const url = new Url({ originalUrl, shortCode, userId });
  await url.save();
  return url;
}

export default Url;
