import rateLimit from 'express-rate-limit';

export const scanRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 scan requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many scan requests from this IP, please try again after 15 minutes'
  }
});
