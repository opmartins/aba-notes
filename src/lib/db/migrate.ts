import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

await migrate(db, { migrationsFolder: path.join(process.cwd(), "src/lib/db/migrations") });

console.log("Migração concluída.");
