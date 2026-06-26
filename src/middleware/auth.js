import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';

/**
 * Middleware to protect routes — verifies JWT token from Authorization header.
 * Sets req.user if token is valid.
 */
export const protect = async (req, res, next) => {
  try {
    // 1. Check if Authorization header exists and starts with "Bearer"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // 2. Extract token from header
    const token = authHeader.split(' ')[1];

    // 3. Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);

    // 4. Find the user from DB (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    // 5. Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

/**
 * Middleware to restrict access to specific roles.
 * Must be used AFTER the protect middleware.
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'user')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};
