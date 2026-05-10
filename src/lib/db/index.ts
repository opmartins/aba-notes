import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";
import * as schema from "./schema";

const DB_PATH = path.join(process.cwd(), "data", "vbmapp.db");
const MIGRATIONS_PATH = path.join(process.cwd(), "src/lib/db/migrations");

type Db = ReturnType<typeof drizzle<typeof schema>>;
let _db: Db | null = null;

export function getDb(): Db {
  if (_db) return _db;

  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: MIGRATIONS_PATH });
  _db = db;
  return _db;
}

export * from "./schema";
