import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { loadLocalEnv, databaseClient, safeFailure } from "./database.mjs";
loadLocalEnv();
const client = databaseClient();
try {
  await client.connect();
  await client.query("begin");
  await client.query(
    "select pg_advisory_xact_lock(hashtext('tinysteps_migrations'))",
  );
  await client.query("create schema if not exists tinysteps_private");
  await client.query(
    "revoke all on schema tinysteps_private from public,anon,authenticated",
  );
  await client.query(
    "create table if not exists tinysteps_private.schema_migrations(version text primary key,checksum text not null,applied_at timestamptz not null default now())",
  );
  for (const file of (await readdir("supabase/migrations"))
    .filter((f) => f.endsWith(".sql"))
    .sort()) {
    const sql = await readFile("supabase/migrations/" + file, "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const prior = await client.query(
      "select checksum from tinysteps_private.schema_migrations where version=$1",
      [file],
    );
    if (prior.rows.length) {
      if (prior.rows[0].checksum !== checksum)
        throw new Error("Applied migration checksum mismatch");
      console.log("Already applied:", file);
      continue;
    }
    await client.query(sql);
    await client.query(
      "insert into tinysteps_private.schema_migrations(version,checksum) values($1,$2)",
      [file, checksum],
    );
    console.log("Applied:", file);
  }
  await client.query("commit");
  console.log("Migrations committed.");
} catch (error) {
  await client.query("rollback").catch(() => {});
  safeFailure(error);
} finally {
  await client.end().catch(() => {});
}
