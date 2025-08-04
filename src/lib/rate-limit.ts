interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(ip: string): boolean {
    const now = Date.now();
    const record = this.store[ip];

    if (!record || now > record.resetTime) {
      // First request or window expired
      this.store[ip] = {
        count: 1,
        resetTime: now + this.config.windowMs
      };
      return true;
    }

    if (record.count >= this.config.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingRequests(ip: string): number {
    const record = this.store[ip];
    if (!record || Date.now() > record.resetTime) {
      return this.config.maxRequests;
    }
    return Math.max(0, this.config.maxRequests - record.count);
  }

  getResetTime(ip: string): number {
    const record = this.store[ip];
    return record ? record.resetTime : Date.now() + this.config.windowMs;
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(ip => {
      if (now > this.store[ip].resetTime) {
        delete this.store[ip];
      }
    });
  }
}

// Create rate limiters for different endpoints
export const aiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10 // 10 requests per minute
});

export const uploadRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5 // 5 uploads per minute
});

// Clean up expired entries every 5 minutes
setInterval(() => {
  aiRateLimiter.cleanup();
  uploadRateLimiter.cleanup();
}, 5 * 60 * 1000);

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback for development
  return '127.0.0.1';
} 