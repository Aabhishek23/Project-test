import { Router } from 'express';
import { getAllUsers } from '../controllers/users.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all registered users (Admin only)
 * @access  Private (Admin only)
 */
router.get('/', protect, restrictTo('admin'), getAllUsers);

export default router;
