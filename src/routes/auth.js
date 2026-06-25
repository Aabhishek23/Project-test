import { Router } from 'express';
import { register } from '../controllers/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema } from '../validators/auth.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), register);

export default router;
