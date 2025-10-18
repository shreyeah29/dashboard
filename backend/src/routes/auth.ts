import express from 'express';
import jwt from 'jsonwebtoken';
import { adminOnly } from '../middleware/auth';

const router = express.Router();

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (password !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: 'admin',
        isAdmin: true 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Set httpOnly cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ 
      message: 'Login successful',
      user: { id: 'admin', isAdmin: true }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin logout
router.post('/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logout successful' });
});

// Verify admin token
router.get('/admin/verify', adminOnly, (req, res) => {
  res.json({ 
    message: 'Token is valid',
    user: req.user
  });
});

export default router;
