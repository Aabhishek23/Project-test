import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();

// Configure CORS
app.use(cors({
  origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(','),
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api', apiRoutes);

// Root route redirect to welcome API
app.get('/', (req, res) => {
  res.redirect('/api/welcome');
});

// Catch-all route handler for 404s
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
