import { Context, type Next } from "hono";
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from "../utils/constants";
import { ApiError } from "../utils/errors";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

export async function rateLimitMiddleware(c: Context, next: Next) {
  const ip =
    c.req.header("x-forwarded-for") ||
    c.req.header("cf-connecting-ip") ||
    "unknown";
  const now = Date.now();

  let entry = rateLimitMap.get(ip);

  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitMap.set(ip, entry);
  }

  entry.count++;

  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    throw new ApiError(
      429,
      "RATE_LIMIT_EXCEEDED",
      `Rate limit exceeded. Max ${RATE_LIMIT_MAX_REQUESTS} requests per ${RATE_LIMIT_WINDOW_MS / 1000 / 60} minutes`,
    );
  }

  // Add rate limit headers
  c.header("X-RateLimit-Limit", String(RATE_LIMIT_MAX_REQUESTS));
  c.header(
    "X-RateLimit-Remaining",
    String(RATE_LIMIT_MAX_REQUESTS - entry.count),
  );
  c.header("X-RateLimit-Reset", String(entry.resetTime));

  await next();
}
