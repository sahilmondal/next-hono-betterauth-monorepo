import { Context, type Next, type StatusCode } from "hono";
import { logger } from "../config/logger";
import { ApiError } from "../utils/errors";
import { errorResponse } from "../utils/response";
import { ZodError } from "zod";

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    const requestId = c.req.header("x-request-id") || "unknown";

    if (error instanceof ZodError) {
      const formattedErrors = error.errors.reduce(
        (acc, err) => {
          const path = err.path.join(".");
          acc[path] = err.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      logger.warn({ requestId, errors: formattedErrors }, "Validation error");
      return c.json(errorResponse(formattedErrors, "VALIDATION_ERROR"), {
        status: 400 as StatusCode,
      });
    }

    if (error instanceof ApiError) {
      logger.warn(
        { requestId, statusCode: error.statusCode, code: error.code },
        error.message,
      );
      return c.json(errorResponse(error.message, error.code), {
        status: error.statusCode as StatusCode,
      });
    }

    if (error instanceof Error) {
      logger.error(
        { requestId, error: error.message, stack: error.stack },
        "Unexpected error",
      );
      return c.json(errorResponse("Internal server error", "INTERNAL_ERROR"), {
        status: 500 as StatusCode,
      });
    }

    logger.error({ requestId, error }, "Unknown error");
    return c.json(errorResponse("Internal server error", "INTERNAL_ERROR"), {
      status: 500 as StatusCode,
    });
  }
}
