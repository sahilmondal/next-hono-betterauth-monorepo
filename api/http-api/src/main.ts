import { Hono } from "hono";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler } from "./middleware/error-handler";
import { loggerMiddleware } from "./middleware/logger";
import { rateLimitMiddleware } from "./middleware/rate-limit";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { auth } from "./lib/auth";
import type { HonoContext } from "./types";
import usersRoute from "./modules/users/users.route";

const app = new Hono<HonoContext>();

// Database connection test
(async function testDbConnection() {
  // Simulate async DB connection test
  try {
    await db.execute(sql`SELECT 1`);
    logger.info("Database connection successful");
  } catch (error) {
    logger.error(
      `Database connection failed - ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
})();

// Middleware stack (order matters)
app.use(errorHandler);
app.use(loggerMiddleware);
app.use(compress());
app.use(
  cors({
    origin:
      env?.FRONTEND_ORIGINS?.split(",").map((origin: string) => origin.trim()) ||
      "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);
app.use(rateLimitMiddleware);
// Authentication middleware to attach user and session to context
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }
  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

// Health check and API routes (chained for Hono RPC type extraction)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .get("/health", (c) => {
    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  })
  .route("/users", usersRoute);

// Authentication routes (handled by BetterAuth, not part of standard RPC client)
app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

export type AppType = typeof routes;


// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Not found",
      code: "NOT_FOUND",
    },
    404,
  );
});

logger.info(`🚀 Server starting on port ${env.PORT} in ${env.NODE_ENV} mode`);

export default app;
