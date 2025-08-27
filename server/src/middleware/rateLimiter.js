const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

const searchLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many search requests, please try again later'
);

const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  200, // limit each IP to 200 requests per windowMs
  'Too many requests, please try again later'
);

module.exports = {
  searchLimiter,
  generalLimiter
};