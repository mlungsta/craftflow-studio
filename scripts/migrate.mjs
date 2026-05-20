import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { Client } from "pg";

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const migrationPath = path.resolve(process.cwd(), "db", "migrations", "0001_phase1_init.sql");
  const sql = fs.readFileSync(migrationPath, "utf8");

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(sql);
    console.log("Migration applied: 0001_phase1_init.sql");
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Migration failed", error);
  process.exit(1);
});
