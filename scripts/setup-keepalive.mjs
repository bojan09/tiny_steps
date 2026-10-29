import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { Client } from "pg";
import { loadLocalEnv, databaseClient, safeFailure } from "./database.mjs";
loadLocalEnv();
const db = databaseClient();
let probe;
try {
  await db.connect();
  const existing = await db.query(
    "select 1 from pg_roles where rolname='tinysteps_healthcheck'",
  );
  if (existing.rowCount)
    throw Object.assign(new Error(), {
      code: "ROLE_ALREADY_EXISTS_NO_ROTATION",
    });
  const password = randomBytes(32).toString("hex");
  await db.query("begin");
  await db.query(
    "create role tinysteps_healthcheck login password '" +
      password +
      "' nosuperuser nocreatedb nocreaterole noinherit noreplication connection limit 2",
  );
  await db.query("grant connect on database postgres to tinysteps_healthcheck");
  await db.query("grant usage on schema public to tinysteps_healthcheck");
  await db.query(
    "grant execute on function public.tinysteps_healthcheck() to tinysteps_healthcheck",
  );
  await db.query(
    "alter role tinysteps_healthcheck set statement_timeout='10s'",
  );
  await db.query("commit");
  const url = new URL(process.env.DIRECT_URL || process.env.DATABASE_URL),
    oldUser = decodeURIComponent(url.username);
  url.username =
    "tinysteps_healthcheck" +
    (oldUser.includes(".") ? "." + oldUser.split(".").slice(1).join(".") : "");
  url.password = password;
  url.searchParams.delete("pgbouncer");
  url.searchParams.delete("connection_limit");
  // Save before probing so a network failure does not lose the generated credential.
  await writeFile(
    ".env.keepalive.local",
    "SUPABASE_KEEPALIVE_DATABASE_URL=" + url.toString() + "\n",
    { flag: "wx", mode: 0o600 },
  );
  probe = new Client({
    connectionString: url.toString(),
    connectionTimeoutMillis: 15000,
  });
  await probe.connect();
  const result = await probe.query(
    "select public.tinysteps_healthcheck() as healthy",
  );
  if (result.rows[0]?.healthy !== true) throw new Error();
  for (const table of [
    "public.profiles",
    "public.user_preferences",
    "tinysteps_private.healthcheck",
  ]) {
    let denied = false;
    try {
      await probe.query("select * from " + table + " limit 1");
    } catch (e) {
      if (e.code === "42501") denied = true;
      else throw e;
    }
    if (!denied) throw Object.assign(new Error(), { code: "EXCESS_PRIVILEGE" });
  }
  console.log(
    "Restricted health login verified; private DSN saved to ignored .env.keepalive.local. No credential printed.",
  );
} catch (error) {
  await db.query("rollback").catch(() => {});
  safeFailure(error);
} finally {
  await probe?.end().catch(() => {});
  await db.end().catch(() => {});
}
