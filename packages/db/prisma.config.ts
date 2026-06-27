import path from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPaths = [
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "../../.env"),
];

for (const envPath of envPaths) {
  loadEnv({ path: envPath, override: false });
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in packages/db/.env or paytm-project/.env");
}

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
