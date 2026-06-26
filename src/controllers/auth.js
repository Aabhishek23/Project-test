import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';

/**
 * Helper — generate a JWT token for a user
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already in use',
      });
    }

    // Create and save new user (this triggers the password hashing pre-save hook)
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Respond with created user data (excluding password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user and return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 2. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset (change) logged-in user's password
 * @route   PUT /api/auth/reset-password
 * @access  Private (requires JWT token)
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Get user with password field (select excludes it by default via protect middleware)
    const user = await User.findById(req.user._id);

    // 2. Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // 3. Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update logged-in user's profile (username / email)
 * @route   PUT /api/auth/update-profile
 * @access  Private (requires JWT token)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email is already in use by another account',
        });
      }
    }

    // Build update object with only provided fields
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
