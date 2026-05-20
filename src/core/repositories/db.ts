import { Pool } from "pg";
import { getEnv } from "@/core/config/env";

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const env = getEnv();
    pool = new Pool({ connectionString: env.DATABASE_URL });
  }

  return pool;
}
