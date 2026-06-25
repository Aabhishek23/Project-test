import config from '../config/index.js';

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(config.env === 'development' && { stack: err.stack }),
  };

  // Log the error stack in development, or the message in production
  if (config.env === 'development') {
    console.error(`[Error] ${statusCode} - ${err.message}\n`, err.stack);
  } else {
    console.error(`[Error] ${statusCode} - ${err.message}`);
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
