import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

let inicializado = false;

export function inicializarBanco() {
  if (inicializado) return;
  inicializado = true;

  const dbPath = path.join(process.cwd(), "data", "vbmapp.db");
  const migrationsFolder = path.join(process.cwd(), "src/lib/db/migrations");

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  const db = drizzle(sqlite);
  migrate(db, { migrationsFolder });

  sqlite.close();
}
