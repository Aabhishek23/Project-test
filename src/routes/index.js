import { Router } from 'express';
import authRoutes from './auth.js';
import usersRoutes from './users.js';

const router = Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Mount users routes (admin only)
router.use('/users', usersRoutes);

/**
 * @route   GET /api/health
 * @desc    Get health status of the application
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * @route   GET /api/welcome
 * @desc    Welcome endpoint
 * @access  Public
 */
router.get('/welcome', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Express API!',
  });
});

export default router;
