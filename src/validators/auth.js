import { z } from 'zod';

/**
 * Validation schema for User Registration
 */
export const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ required_error: 'Username is required' })
      .trim()
      .min(3, 'Username must be at least 3 characters long')
      .max(30, 'Username cannot exceed 30 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(50, 'Password cannot exceed 50 characters'),
  }),
});

/**
 * Validation schema for User Login
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

/**
 * Validation schema for Reset (Change) Password
 * User must provide their current password and a new password
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, 'New password must be at least 6 characters long')
      .max(50, 'New password cannot exceed 50 characters'),
  }),
});

/**
 * Validation schema for Update User Profile (username / email)
 */
export const updateProfileSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters long')
      .max(30, 'Username cannot exceed 30 characters')
      .optional(),
    email: z
      .string()
      .trim()
      .email('Invalid email address format')
      .optional(),
  }).refine(
    (data) => data.username || data.email,
    { message: 'At least one field (username or email) must be provided' }
  ),
});
