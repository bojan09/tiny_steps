import { Client } from "pg";
export function loadLocalEnv() {
  try {
    process.loadEnvFile(".env");
  } catch {}
}
export function databaseClient() {
  const raw = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!raw) throw new Error("Database connection is not configured");
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Invalid database connection format");
  }
  url.searchParams.delete("pgbouncer");
  url.searchParams.delete("connection_limit");
  return new Client({
    connectionString: url.toString(),
    connectionTimeoutMillis: 15000,
    query_timeout: 30000,
  });
}
export function safeFailure(error) {
  console.error("Operation failed:", error?.code || error?.name || "unknown");
  process.exitCode = 1;
}
