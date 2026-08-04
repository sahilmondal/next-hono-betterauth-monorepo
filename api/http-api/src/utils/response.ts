import type { Context, StatusCode } from "hono";
import type { ApiResponse } from "../types";

export function successResponse<T>(
  data: T,
  message = "Success",
 ): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(
  error: string | object,
  code = "INTERNAL_ERROR",
): ApiResponse {
  return {
    success: false,
    error,
    code,
  };
}

export async function sendSuccess<T>(
  c: Context,
  data: T,
  message = "Success",
  statusCode = 200,
) {
  return c.json(successResponse(data, message), {
    status: statusCode as StatusCode,
  });
}

export async function sendError(
  c: Context,
  error: string | object,
  code = "INTERNAL_ERROR",
  statusCode = 400,
) {
  return c.json(errorResponse(error, code), {
    status: statusCode as StatusCode,
  });
}
