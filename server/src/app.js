const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const repositoryRoutes = require('./routes/repositories');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

const app = express();

// Connect Database
connectDB();

// Debug middleware - Add this first to catch all requests
app.use((req, res, next) => {
  next();
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
app.use(generalLimiter);

app.use((req, res, next) => {
  console.log('Origin received:', req.headers.origin);
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  next();
});

// CORS
app.use(cors({
  origin: [                     
    'http://localhost:5173',                       
    'https://github-repo-ygmh.vercel.app',   
    process.env.CORS_ORIGIN     
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Route debugging middleware
app.use((req, res, next) => {
  
  next();
});

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GitHub Repository Search API is running! 🚀',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      repositories: {
        search: '/api/repositories/search?keyword=react',
        getAll: '/api/repositories',
        history: '/api/repositories/history'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  
  res.status(200).json({
    success: true,
    message: 'Server is healthy ✅',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug middleware for repository routes
app.use('/api/repositories', (req, res, next) => {
  next();
}, repositoryRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {

  if (err instanceof TypeError && err.message.includes('Missing parameter name')) {
    return res.status(500).json({
      success: false,
      message: 'Invalid route configuration detected',
      error: err.message,
      path: req.path
    });
  }

  next(err);
});

app.use(errorHandler);

module.exports = app;