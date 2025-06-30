import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecretkey';

// ✅ Generate short-lived access token
export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '15m' } // 🔐 Short lifespan for access token
  );
}

// ✅ Generate long-lived refresh token (for cookies)
export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

// ✅ Middleware to protect routes using access token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

// ✅ Verify refresh token from cookies (used in /auth/refresh)
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch {
    return null;
  }
}
