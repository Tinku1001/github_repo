const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Enhanced error logging
const logError = (type, err) => {
  logger.error(`💥 ${type}:`, {
    name: err.name,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logError('Uncaught Exception', err);
  // Give time for logging before exit
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

const server = app.listen(PORT, () => {
  logger.info('🚀 Server Status:', {
    environment: process.env.NODE_ENV,
    port: PORT,
    pid: process.pid,
    timestamp: new Date().toISOString(),
    endpoints: {
      api: `http://localhost:${PORT}`,
      health: `http://localhost:${PORT}/health`,
      docs: `http://localhost:${PORT}/api/repositories`
    }
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logError('Unhandled Promise Rejection', err);
  server.close(() => {
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('⚡ SIGTERM received - Initiating graceful shutdown');
  server.close(() => {
    logger.info('✅ Server closed successfully');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  logger.info('⚡ SIGINT received - Initiating graceful shutdown');
  server.close(() => {
    logger.info('✅ Server closed successfully');
    process.exit(0);
  });
});

// Log any server errors
server.on('error', (err) => {
  logError('Server Error', err);
});