const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    
    // For development, you can work without MongoDB temporarily
    if (process.env.NODE_ENV === 'development') {
      logger.warn('🚧 Running in development mode without MongoDB');
      logger.warn('💡 Install MongoDB or use MongoDB Atlas to enable full functionality');
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;