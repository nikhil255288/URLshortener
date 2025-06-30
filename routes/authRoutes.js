import express from 'express';
import { loginUser, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);        // ✅ Add this if not already
router.post('/refresh', refreshToken);   // already exists

export default router;
