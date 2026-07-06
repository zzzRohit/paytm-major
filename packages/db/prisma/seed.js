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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await pool.query(
    `
      INSERT INTO "User" ("name", "email", "phone", "password")
      VALUES ($1, $2, $3, $4)
      ON CONFLICT ("phone") DO UPDATE
      SET
        "name" = EXCLUDED."name",
        "email" = EXCLUDED."email",
        "password" = EXCLUDED."password"
    `,
    [
      "Test User",
      "testuser@example.com",
      "9876543210",
      "$2b$10$dDdKPiwoFNDQfr8WhlTfe.iRAmLr4SmD86bIUgnF5E05fxub39ZwG",
    ],
  );

  // Add a few more test users with balances
  const users = [
    {
      name: "Test User A",
      email: "usera@example.com",
      phone: "9876543211",
      password: "$2b$10$dDdKPiwoFNDQfr8WhlTfe.iRAmLr4SmD86bIUgnF5E05fxub39ZwG",
      balance: 500,
    },
    {
      name: "Test User B",
      email: "userb@example.com",
      phone: "9876543212",
      password: "$2b$10$dDdKPiwoFNDQfr8WhlTfe.iRAmLr4SmD86bIUgnF5E05fxub39ZwG",
      balance: 300,
    },
    {
      name: "Test User C",
      email: "userc@example.com",
      phone: "9876543213",
      password: "$2b$10$dDdKPiwoFNDQfr8WhlTfe.iRAmLr4SmD86bIUgnF5E05fxub39ZwG",
      balance: 100,
    },
  ];

  for (const u of users) {
    await pool.query(
      `
        INSERT INTO "User" ("name", "email", "phone", "password")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("phone") DO UPDATE
        SET
          "name" = EXCLUDED."name",
          "email" = EXCLUDED."email",
          "password" = EXCLUDED."password"
      `,
      [u.name, u.email, u.phone, u.password],
    );

    await pool.query(
      `
        INSERT INTO "Balance" ("userId", "amount", "locked")
        SELECT id, $1, $2 FROM "User" WHERE phone = $3
        ON CONFLICT ("userId") DO UPDATE
        SET
          "amount" = EXCLUDED."amount",
          "locked" = EXCLUDED."locked"
      `,
      [u.balance, 0, u.phone],
    );
  }

  // Ensure the original test user has a balance too
  await pool.query(
    `
      INSERT INTO "Balance" ("userId", "amount", "locked")
      SELECT id, $1, $2 FROM "User" WHERE phone = $3
      ON CONFLICT ("userId") DO UPDATE
      SET
        "amount" = EXCLUDED."amount",
        "locked" = EXCLUDED."locked"
    `,
    [200, 0, "9876543210"],
  );

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
