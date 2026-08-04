import { authMiddleware } from "../../middleware/auth";
import type { HonoContext } from "../../types";
import { Hono } from "hono";
import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});

const usersRoute = new Hono<HonoContext>().get(
  "/me",
  authMiddleware,
  async (c) => {
    const user = c.get("user");
    return c.json({ user });
  },
);

export default usersRoute;
