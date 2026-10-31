import { randomBytes, createHmac } from "node:crypto";
import {
  mkdtemp,
  writeFile,
  readFile,
  cp,
  symlink,
  rm,
  mkdir,
} from "node:fs/promises";
import { join, resolve, basename } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createServer, request } from "node:http";
import { createServer as createPortProbe } from "node:net";

const root = resolve(import.meta.dirname, "..");
const work = await mkdtemp("/tmp/tinysteps-integration-");
const prefix = basename(work).toLowerCase();
const containers = [];
let gateway,
  app,
  networkCreated = false;
const secrets = [
  randomBytes(24).toString("hex"),
  randomBytes(48).toString("hex"),
];
const [password, jwtSecret] = secrets;
const baseEnv = { ...process.env };
for (const key of [
  "DOCKER_HOST",
  "DOCKER_CONTEXT",
  "DOCKER_TLS",
  "DOCKER_TLS_VERIFY",
  "DOCKER_CERT_PATH",
])
  delete baseEnv[key];
const redact = (text) =>
  secrets.reduce(
    (value, secret) => value.replaceAll(secret, "[local test credential]"),
    text,
  );
function docker(args, input) {
  const result = spawnSync(
    "docker",
    ["--host=unix:///var/run/docker.sock", ...args],
    { env: baseEnv, input, encoding: "utf8", maxBuffer: 2 ** 20 },
  );
  if (result.status !== 0)
    throw new Error(
      "Docker operation failed: " +
        redact(result.stderr || result.error?.message || "unknown"),
    );
  return (result.stdout + (args[0] === "logs" ? result.stderr : "")).trim();
}
async function envFile(name, values) {
  const path = join(work, name);
  await writeFile(
    path,
    Object.entries(values)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n") + "\n",
    { mode: 0o600 },
  );
  return path;
}
async function waitFor(check, label) {
  const deadline = Date.now() + 60000;
  let last;
  while (Date.now() < deadline) {
    try {
      if (await check()) return;
    } catch (e) {
      if (e.fatal) throw e;
      last = e;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(
    label + " was not ready" + (last ? " (" + redact(last.message) + ")" : ""),
  );
}
function jwt(role) {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({
      iss: "tinysteps-isolated-test",
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  ).toString("base64url");
  return `${header}.${body}.${createHmac("sha256", jwtSecret).update(`${header}.${body}`).digest("base64url")}`;
}
async function runNode(args, env, cwd) {
  await new Promise((res, rej) => {
    const child = spawn(process.execPath, args, {
      env,
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", (d) => process.stdout.write(redact(d.toString())));
    child.stderr.on("data", (d) => process.stderr.write(redact(d.toString())));
    child.on("error", rej);
    child.on("exit", (code) =>
      code === 0
        ? res()
        : rej(new Error("Verification command exited " + code)),
    );
  });
}
const pgImage =
  "postgres@sha256:f3bd19c606e442c3d7bdfa8002e03fe260a1023351e0ea4598032022b68dd6e3";
const authImage =
  "supabase/gotrue@sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b";
const restImage =
  "postgrest/postgrest@sha256:c7cd7e265a85b05248abf53f4473fcec7e327c282d0bd0cf60f1551996d09fcf";
const report = {
  startedAt: new Date().toISOString(),
  scope:
    "Disposable local Auth/PostgreSQL/PostgREST; production was not tested or mutated.",
  images: { postgres: pgImage, auth: authImage, postgrest: restImage },
  rls: "unrun",
  build: "unrun",
  browser: "unrun",
  cleanup: "unrun",
  passed: false,
};
try {
  await new Promise((resolve, reject) => {
    const probe = createPortProbe();
    probe.once("error", () =>
      reject(
        new Error(
          "Port 3000 is in use; stop only your own development server before integration tests.",
        ),
      ),
    );
    probe.listen(3000, "127.0.0.1", () => probe.close(resolve));
  });
  docker(["info", "--format", "{{.ServerVersion}}"]);
  docker(["network", "create", prefix]);
  networkCreated = true;
  const pgName = prefix + "-db";
  containers.push(pgName);
  const pgEnv = await envFile("postgres.env", {
    POSTGRES_PASSWORD: password,
    POSTGRES_DB: "postgres",
  });
  console.log("Starting isolated PostgreSQL 17 (no production connection).");
  docker([
    "run",
    "-d",
    "--name",
    pgName,
    "--network",
    prefix,
    "--network-alias",
    "db",
    "--cpus",
    "2",
    "--memory",
    "1g",
    "--env-file",
    pgEnv,
    pgImage,
  ]);
  await waitFor(() => {
    try {
      docker([
        "exec",
        pgName,
        "pg_isready",
        "-h",
        "127.0.0.1",
        "-U",
        "postgres",
      ]);
      return true;
    } catch {
      return false;
    }
  }, "PostgreSQL");
  const bootstrap = await readFile(
    join(root, "scripts/integration/bootstrap.sql"),
    "utf8",
  );
  docker(
    [
      "exec",
      "-i",
      pgName,
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-v",
      "authenticator_password=" + password,
    ],
    bootstrap,
  );
  const authName = prefix + "-auth";
  containers.push(authName);
  const authEnv = await envFile("auth.env", {
    GOTRUE_API_HOST: "0.0.0.0",
    GOTRUE_API_PORT: "9999",
    API_EXTERNAL_URL: "http://127.0.0.1:54320",
    GOTRUE_SITE_URL: "http://127.0.0.1:3000",
    GOTRUE_DB_DRIVER: "postgres",
    GOTRUE_DB_DATABASE_URL: `postgres://supabase_auth_admin:${password}@db:5432/postgres`,
    GOTRUE_DB_NAMESPACE: "auth",
    GOTRUE_JWT_SECRET: jwtSecret,
    GOTRUE_JWT_AUD: "authenticated",
    GOTRUE_JWT_DEFAULT_GROUP_NAME: "authenticated",
    GOTRUE_JWT_ADMIN_ROLES: "service_role",
    GOTRUE_JWT_EXP: "3600",
    GOTRUE_EXTERNAL_EMAIL_ENABLED: "true",
    GOTRUE_MAILER_AUTOCONFIRM: "true",
    GOTRUE_DISABLE_SIGNUP: "false",
    GOTRUE_LOG_LEVEL: "error",
  });
  docker([
    "run",
    "-d",
    "--name",
    authName,
    "--network",
    prefix,
    "-p",
    "127.0.0.1::9999",
    "--cpus",
    "1",
    "--memory",
    "512m",
    "--env-file",
    authEnv,
    authImage,
  ]);
  const authPort = Number(
    docker(["port", authName, "9999/tcp"]).split(":").at(-1),
  );
  await waitFor(async () => {
    if (
      docker(["inspect", "--format", "{{.State.Status}}", authName]) ===
      "exited"
    )
      throw Object.assign(new Error("Auth exited during migrations"), {
        fatal: true,
      });
    const r = await fetch(`http://127.0.0.1:${authPort}/health`);
    return r.ok;
  }, "Auth migrations");
  console.log(
    "Applying the committed application migration to the isolated database.",
  );
  docker(
    ["exec", "-i", pgName, "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1"],
    await readFile(join(root, "scripts/integration/auth-claims.sql"), "utf8"),
  );
  const migration = await readFile(
    join(root, "supabase/migrations/202610290001_account_foundation.sql"),
    "utf8",
  );
  docker(
    ["exec", "-i", pgName, "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1"],
    migration,
  );
  const restName = prefix + "-rest";
  containers.push(restName);
  const restEnv = await envFile("rest.env", {
    PGRST_DB_URI: `postgres://authenticator:${password}@db:5432/postgres`,
    PGRST_DB_SCHEMAS: "public",
    PGRST_DB_ANON_ROLE: "anon",
    PGRST_JWT_SECRET: jwtSecret,
  });
  docker([
    "run",
    "-d",
    "--name",
    restName,
    "--network",
    prefix,
    "-p",
    "127.0.0.1::3000",
    "--cpus",
    "1",
    "--memory",
    "256m",
    "--env-file",
    restEnv,
    restImage,
  ]);
  const restPort = Number(
    docker(["port", restName, "3000/tcp"]).split(":").at(-1),
  );
  gateway = createServer((incoming, outgoing) => {
    const isAuth = incoming.url.startsWith("/auth/v1");
    const isRest = incoming.url.startsWith("/rest/v1");
    if (!isAuth && !isRest) {
      outgoing.writeHead(404);
      outgoing.end();
      return;
    }
    const path =
      incoming.url.replace(isAuth ? "/auth/v1" : "/rest/v1", "") || "/";
    const upstream = request(
      {
        hostname: "127.0.0.1",
        port: isAuth ? authPort : restPort,
        path,
        method: incoming.method,
        headers: incoming.headers,
      },
      (response) => {
        outgoing.writeHead(response.statusCode, response.headers);
        response.pipe(outgoing);
      },
    );
    upstream.on("error", () => {
      if (!outgoing.headersSent) outgoing.writeHead(502);
      outgoing.end();
    });
    incoming.pipe(upstream);
  });
  await new Promise((res, rej) => {
    gateway.once("error", rej);
    gateway.listen(0, "127.0.0.1", res);
  });
  const url = `http://127.0.0.1:${gateway.address().port}`;
  const anon = jwt("anon"),
    service = jwt("service_role");
  secrets.push(anon, service);
  await waitFor(async () => {
    const r = await fetch(url + "/rest/v1/", {
      headers: { Authorization: "Bearer " + anon },
    });
    return r.ok;
  }, "PostgREST");
  const localEnv = {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: anon,
    SERVICE_ROLE_KEY: service,
    TINYSTEPS_CHROMIUM_EXECUTABLE:
      process.env.TINYSTEPS_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  };
  delete localEnv.DATABASE_URL;
  delete localEnv.DIRECT_URL;
  // No .env files are copied; local values override all production bindings.
  const appRoot = join(work, "app");
  await cp(root, appRoot, {
    recursive: true,
    filter: (source) =>
      ![
        ".git",
        ".next",
        "node_modules",
        "test-results",
        "verification-results",
        "playwright-report",
      ].includes(basename(source)) && !basename(source).startsWith(".env"),
  });
  await symlink(
    join(root, "node_modules"),
    join(appRoot, "node_modules"),
    "dir",
  );
  console.log(
    "Running real API/RLS assertions with two disposable local identities.",
  );
  report.rls = "failed";
  await runNode(["scripts/verify-rls.mjs"], localEnv, appRoot);
  report.rls = "passed";
  console.log(
    "Building an isolated copy against local Auth/PostgREST. Production artifacts are unchanged.",
  );
  report.build = "failed";
  await runNode(
    [join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"],
    { ...localEnv, NEXT_TELEMETRY_DISABLED: "1" },
    appRoot,
  );
  report.build = "passed";
  app = spawn(
    process.execPath,
    [
      join(root, "node_modules/next/dist/bin/next"),
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3000",
    ],
    { cwd: appRoot, env: localEnv, stdio: ["ignore", "pipe", "pipe"] },
  );
  app.stdout.on("data", (d) => process.stdout.write(redact(d.toString())));
  app.stderr.on("data", (d) => process.stderr.write(redact(d.toString())));
  await waitFor(async () => {
    if (app.exitCode !== null) throw new Error("Isolated app exited");
    const r = await fetch("http://127.0.0.1:3000/api/account");
    return r.ok && (await r.json()).guest === true;
  }, "Isolated application");
  console.log(
    "Running real browser sign-in, persistence, isolation and sign-out checks.",
  );
  report.browser = "failed";
  await runNode(["scripts/verify-account-browser.mjs"], localEnv, appRoot);
  report.browser = "passed";
  console.log(
    "PASS: isolated real Auth/PostgreSQL/PostgREST RLS and browser integration. No production verification is implied.",
  );
} catch (error) {
  for (const name of containers) {
    try {
      console.error(
        docker([
          "inspect",
          "--format",
          "{{.Name}} {{.State.Status}} {{.State.ExitCode}} {{json .NetworkSettings.Ports}}",
          name,
        ]),
      );
      const logs = docker(["logs", "--tail", "18", name]);
      if (logs) console.error(redact(logs).slice(-5000));
    } catch {}
  }
  console.error(redact(error.message));
  report.error = redact(error.message);
  process.exitCode = 1;
} finally {
  if (app && app.exitCode === null) {
    app.kill("SIGTERM");
    await new Promise((res) => {
      const timer = setTimeout(() => {
        app.kill("SIGKILL");
        res();
      }, 5000);
      app.once("exit", () => {
        clearTimeout(timer);
        res();
      });
    });
  }
  await new Promise((res) => (gateway ? gateway.close(res) : res()));
  let cleanupOk = true;
  for (const name of containers.reverse()) {
    try {
      docker(["rm", "-f", "-v", name]);
    } catch (error) {
      if (!/No such (container|object)/i.test(error.message)) {
        cleanupOk = false;
        console.error(redact(error.message));
      }
    }
  }
  try {
    if (networkCreated) docker(["network", "rm", prefix]);
  } catch (error) {
    cleanupOk = false;
    console.error(redact(error.message));
  }
  try {
    await rm(work, { recursive: true, force: true });
  } catch {
    cleanupOk = false;
  }
  report.cleanup = cleanupOk ? "passed" : "failed";
  report.finishedAt = new Date().toISOString();
  report.passed =
    report.rls === "passed" &&
    report.build === "passed" &&
    report.browser === "passed" &&
    cleanupOk;
  if (!cleanupOk) process.exitCode = 1;
  const output = join(root, "verification-results", "local-integration");
  await mkdir(output, { recursive: true });
  await writeFile(
    join(output, "report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    cleanupOk
      ? "Isolated containers, database, copied app and temporary test credentials removed."
      : "Cleanup incomplete; see verification-results/local-integration/report.json.",
  );
}
