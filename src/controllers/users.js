import User from '../models/User.js';

/**
 * Get all registered users (Admin only)
 * @route   GET /api/users
 * @access  Private (Admin only)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      total: users.length,
      data: users.map((user) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};
