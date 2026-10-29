import { Client } from "pg";
const connectionString = process.env.SUPABASE_KEEPALIVE_DATABASE_URL;
if (!connectionString) {
  console.error("Missing SUPABASE_KEEPALIVE_DATABASE_URL repository secret.");
  process.exitCode = 1;
} else {
  let healthy = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const client = new Client({
      connectionString,
      connectionTimeoutMillis: 10000,
      query_timeout: 10000,
      statement_timeout: 10000,
    });
    try {
      await client.connect();
      const result = await client.query(
        "select public.tinysteps_healthcheck() as healthy",
      );
      if (result.rows.length !== 1 || result.rows[0].healthy !== true)
        throw new Error("Unexpected health result");
      console.log("Database health read passed.");
      healthy = true;
      break;
    } catch {
      console.error("Database health read failed (attempt " + attempt + "/3).");
    } finally {
      await client.end().catch(() => {});
    }
    if (attempt < 3)
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
  }
  if (!healthy) process.exitCode = 1;
}
