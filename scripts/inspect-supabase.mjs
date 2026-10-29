import { Client } from "pg";
process.loadEnvFile(".env");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Missing public Supabase configuration");
try {
  const r = await fetch(url + "/auth/v1/settings", {
    headers: { apikey: key },
    signal: AbortSignal.timeout(15000),
  });
  const data = await r.json();
  console.log(
    JSON.stringify({
      authStatus: r.status,
      googleEnabled: data.external?.google === true,
      emailEnabled: data.external?.email === true,
    }),
  );
} catch (e) {
  console.log(JSON.stringify({ authError: e.cause?.code || e.name }));
}
for (const name of ["DIRECT_URL", "DATABASE_URL"]) {
  if (!process.env[name]) continue;
  let connection;
  try {
    connection = new URL(process.env[name]);
  } catch {
    console.log(JSON.stringify({ connection: name, errorCode: "INVALID_URL" }));
    continue;
  }
  connection.searchParams.delete("pgbouncer");
  connection.searchParams.delete("connection_limit");
  const client = new Client({
    connectionString: connection.toString(),
    connectionTimeoutMillis: 15000,
    query_timeout: 15000,
  });
  try {
    await client.connect();
    const r = await client.query(
      "select tablename,rowsecurity from pg_tables where schemaname='public' order by tablename",
    );
    console.log(JSON.stringify({ connection: name, tables: r.rows }));
    await client.end();
    break;
  } catch (e) {
    console.log(
      JSON.stringify({ connection: name, errorCode: e.code || e.name }),
    );
    await client.end().catch(() => {});
  }
}
