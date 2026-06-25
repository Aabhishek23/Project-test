import app from './app.js';
import config from './config/index.js';
import connectDB from './config/database.js';

/**
 * Start the Express Server
 */
const startServer = async () => {
  // Connect to database
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`==========================================`);
    console.log(`  Server is running in ${config.env} mode`);
    console.log(`  URL: http://localhost:${config.port}`);
    console.log(`==========================================`);
  });

  // Handle graceful shutdown on process termination signals
  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
    server.close(() => {
      console.log('HTTP server closed. Process exiting.');
      process.exit(0);
    });
    
    // Force exit if shutdown takes too long (e.g. 10s)
    setTimeout(() => {
      console.error('Could not close connections in time, forcing shut down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();
