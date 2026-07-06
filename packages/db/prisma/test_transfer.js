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
  const fromPhone = "9876543211";
  const toPhone = "9876543212";
  const amount = 50;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Lock both balances by selecting FOR UPDATE
    const fromRow = await client.query(
      `SELECT u.id, b.amount FROM "User" u JOIN "Balance" b ON b."userId" = u.id WHERE u.phone = $1 FOR UPDATE`,
      [fromPhone],
    );
    const toRow = await client.query(
      `SELECT u.id, b.amount FROM "User" u JOIN "Balance" b ON b."userId" = u.id WHERE u.phone = $1 FOR UPDATE`,
      [toPhone],
    );

    if (fromRow.rowCount === 0) throw new Error("From user not found");
    if (toRow.rowCount === 0) throw new Error("To user not found");

    const from = fromRow.rows[0];
    const to = toRow.rows[0];

    if (from.amount < amount)
      throw new Error("Insufficient funds in from account");

    await client.query(
      `UPDATE "Balance" SET amount = amount - $1 WHERE "userId" = $2`,
      [amount, from.id],
    );
    await client.query(
      `UPDATE "Balance" SET amount = amount + $1 WHERE "userId" = $2`,
      [amount, to.id],
    );

    await client.query(
      `INSERT INTO "p2pTransfer" ("amount", "timestamp", "fromUserId", "toUserId") VALUES ($1, NOW(), $2, $3)`,
      [amount, from.id, to.id],
    );

    await client.query("COMMIT");
    console.log("Transfer successful");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Transfer failed:", e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
