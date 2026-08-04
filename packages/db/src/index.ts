import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index.js";

// Resolves __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cascade load environment variables:
// 1. Current package directory (.env)
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// 2. Workspace root directory (.env)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
// 3. Backend API directory (.env)
dotenv.config({ path: path.resolve(__dirname, "../../../api/http-api/.env") });

export * from "./schema/index.js";
export * from "drizzle-orm";

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
  },
  schema,
});
