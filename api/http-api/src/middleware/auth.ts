import { AuthError } from "../utils/errors";
import { Context, type Next } from "hono";

export async function authMiddleware(c: Context, next: Next) {
  const session = c.get("session");
  const user = c.get("user");
  if (!session || !user) {
    throw new AuthError("Please log in to access this resource.");
  }
  await next();
}
