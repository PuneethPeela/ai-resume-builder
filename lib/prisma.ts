import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const rawDatabaseUrl = process.env.DATABASE_URL;

// Resilient URL validation to prevent crashes from unconfigured placeholder templates (e.g., Supabase [password] and [id] syntax)
let cleanDatabaseUrl = "postgresql://apple@127.0.0.1:5432/postgres?schema=public";

if (rawDatabaseUrl) {
  const isPlaceholder = rawDatabaseUrl.includes("[password]") || 
                        rawDatabaseUrl.includes("[id]") || 
                        rawDatabaseUrl.trim() === "" ||
                        !rawDatabaseUrl.startsWith("postgres");
  if (!isPlaceholder) {
    cleanDatabaseUrl = rawDatabaseUrl;
  } else {
    console.warn("⚠️ ResumAI Alert: Malformed DATABASE_URL placeholder detected. Falling back to local pgSQL connection to prevent application crash.");
  }
}

let pool: Pool;
try {
  pool = new Pool({
    connectionString: cleanDatabaseUrl,
  });
} catch (err) {
  console.error("Failed to initialize postgres Pool, using fallback:", err);
  pool = new Pool({
    connectionString: "postgresql://apple@127.0.0.1:5432/postgres?schema=public",
  });
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
