/**
 * The simplest possible database layer: node-postgres pool + one idempotent
 * schema file applied at boot. No ORM, no migration tooling — `schema.sql`
 * uses `create table if not exists` / `alter table ... if not exists`, so a
 * fresh database and an existing one both come up correctly.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

export type Sql = {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
};

const __dirname = dirname(fileURLToPath(import.meta.url));

let poolPromise: Promise<Sql> | null = null;

export function getSql(): Promise<Sql> {
  poolPromise ??= (async () => {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Point it at any Postgres (local or Supabase) — see .env.example.",
      );
    }
    const pool = new pg.Pool({ connectionString: url });
    pg.types.setTypeParser(20, Number); // int8 -> number
    const sql: Sql = {
      async query<T>(text: string, params: unknown[] = []): Promise<T[]> {
        const res = await pool.query(text, params);
        return res.rows as T[];
      },
    };
    const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
    await pool.query(schema);
    return sql;
  })().catch((err) => {
    poolPromise = null;
    throw err;
  });
  return poolPromise;
}
