import { Context, type Next } from "hono";
import { logger } from "../config/logger";
import { randomUUID } from "crypto";

export async function loggerMiddleware(c: Context, next: Next) {
  const requestId = c.req.header("x-request-id") || randomUUID();
  const startTime = Date.now();

  c.set("requestId", requestId);

  // Log request
  logger.info(
    {
      requestId,
      method: c.req.method,
      path: c.req.path,
      userAgent: c.req.header("user-agent"),
      ip:
        c.req.header("x-forwarded-for") ||
        c.req.header("cf-connecting-ip") ||
        "unknown",
    },
    "Incoming request",
  );

  await next();

  // Log response
  const duration = Date.now() - startTime;
  logger.info(
    {
      requestId,
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration: `${duration}ms`,
    },
    "Request completed",
  );
}
