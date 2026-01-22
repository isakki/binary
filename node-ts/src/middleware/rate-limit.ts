import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

/**
 * Rate limiting middleware - 5 requests per 10 minutes per user
 */
export const rateLimitMiddleware = (maxRequests: number = 5, windowMs: number = 10 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Use userId from params or IP address as identifier
    const userId = req.params.userId || req.ip || 'unknown';
    const key = `${req.path}-${userId}`;
    const now = Date.now();

    if (!rateLimitStore[key]) {
      rateLimitStore[key] = { count: 0, resetTime: now + windowMs };
    }

    const record = rateLimitStore[key];

    // Reset if window has passed
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    // Increment counter
    record.count++;

    // Set rate limit headers
    const remainingRequests = Math.max(0, maxRequests - record.count);
    const resetTime = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remainingRequests);
    res.setHeader('X-RateLimit-Reset', resetTime);

    // Check if limit exceeded
    if (record.count > maxRequests) {
      return res.status(429).json({
        statusCode: 429,
        message: `Too many requests. Maximum ${maxRequests} requests allowed per 10 minutes. Try again in ${resetTime} seconds.`,
        retryAfter: resetTime
      });
    }

    next();
  };
};
