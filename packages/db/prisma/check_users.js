import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

for (const envPath of [
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../../.env"),
]) {
  loadEnv({ path: envPath, override: false });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set in packages/db/.env or paytm-project/.env",
  );
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const res = await pool.query(`
    SELECT u.id, u.name, u.phone, b.amount, b.locked
    FROM "User" u
    LEFT JOIN "Balance" b ON b."userId" = u.id
    WHERE u.phone LIKE '987654321%'
    ORDER BY u.phone
  `);

  console.table(res.rows);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
