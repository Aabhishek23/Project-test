import User from '../models/User.js';

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
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
