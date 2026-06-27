import path from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadEnv } from "dotenv";
import { PrismaClient } from "./generated/client/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

for (const envPath of [
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "../../.env"),
]) {
  loadEnv({ path: envPath, override: false });
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

type PrismaGlobal = typeof globalThis & {
  prisma?: PrismaClient;
  prismaAdapter?: PrismaPg;
};

const globalForPrisma = globalThis as PrismaGlobal;
const adapter =
  globalForPrisma.prismaAdapter ??
  new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaAdapter = adapter;
}

export { prisma };
export default prisma;
