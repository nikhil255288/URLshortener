// server/controllers/loginController.js or authController.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user.js'; // make sure this path is correct
import { generateToken, generateRefreshToken } from './auth.js'; // adjust if needed

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // ✅ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // ✅ Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // ✅ Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  sameSite: "Strict",
  secure: false, // true in production with HTTPS
  path: "/auth/refresh",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});


    // ✅ Send access token only in response body
    return res.status(200).json({ token: accessToken });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};
