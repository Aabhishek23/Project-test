import { Router } from 'express';
import { register, login, resetPassword, updateProfile } from '../controllers/auth.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '../validators/auth.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', validate(loginSchema), login);

/**
 * @route   PUT /api/auth/reset-password
 * @desc    Reset (change) logged-in user's password
 * @access  Private (JWT required)
 */
router.put('/reset-password', protect, validate(resetPasswordSchema), resetPassword);

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update logged-in user's profile details (username / email)
 * @access  Private (JWT required)
 */
router.put('/update-profile', protect, validate(updateProfileSchema), updateProfile);

export default router;
