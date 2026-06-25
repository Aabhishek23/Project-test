import { Router } from 'express';

const router = Router();

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
