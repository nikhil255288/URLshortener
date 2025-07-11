// server/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import urlRoutes from './routes/url.js';
import authRoutes from './routes/auth.js';
import shortenRoutes from './routes/shorten.js';
import redirectRoutes from './routes/redirect.js';
import historyRoutes from './routes/history.js';
import analyticsRoutes from './routes/analytics.js';

import { connectToDatabase } from './db.js';

// ✅ Load .env variables
dotenv.config();

// ✅ Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed Origins for CORS
const allowedOrigins = [
  'http://localhost:8080', // Local Vite dev server
  'https://urlshortnerfrontendd.netlify.app', // Netlify frontend
];

// ✅ CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/shorten', shortenRoutes);     // POST /shorten
app.use('/s', redirectRoutes);          // GET /s/:shortCode
app.use('/history', historyRoutes);     // GET /history (protected)
app.use('/analytics', analyticsRoutes); // GET /analytics (protected)
app.use('/auth', authRoutes);           // /auth/login, /auth/signup, /auth/refresh
app.use('/url', urlRoutes);             // PUT/DELETE routes like delete

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('🚀 Lovable URL Shortener API is running');
});

// ✅ Connect to DB and start server
connectToDatabase()
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
