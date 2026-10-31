import { mkdtemp, writeFile, mkdir, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const checks = [
  {
    id: "cdc-milestones",
    url: "https://www.cdc.gov/act-early/milestones/index.html",
    expected: /developmental milestones|learn the signs/i,
  },
  {
    id: "nhs-development",
    url: "https://www.nhs.uk/baby/babys-development/",
    expected: /development/i,
  },
  {
    id: "nhs-home-safety",
    url: "https://www.nhs.uk/baby/safety-and-accidents/baby-and-toddler-safety/",
    expected: /safety/i,
  },
  {
    id: "production-version",
    url: "https://tiny-steps-six.vercel.app/help",
    expected: new RegExp("Version\\s+" + pkg.version.replaceAll(".", "\\.")),
  },
  {
    id: "health-workflow-run",
    url: "https://api.github.com/repos/bojan09/tiny_steps/actions/workflows/supabase-keepalive.yml/runs?per_page=5",
    expected: (body) => {
      try {
        return (
          JSON.parse(body).workflow_runs?.some(
            (run) => run.status === "completed" && run.conclusion === "success",
          ) === true
        );
      } catch {
        return false;
      }
    },
  },
];
const work = await mkdtemp(join(tmpdir(), "tinysteps-release-check-"));
const output = join(root, "verification-results", "external-release");
await mkdir(output, { recursive: true });
const git = spawnSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
});
const report = {
  checkedAt: new Date().toISOString(),
  commit: git.status === 0 ? git.stdout.trim() : null,
  expectedVersion: pkg.version,
  scope:
    "Reachability/content markers and deployed version only. Availability alone does not establish content review.",
  checks: [],
};
try {
  for (const check of checks) {
    await rm(join(output, check.id + ".html"), { force: true });
    const bodyFile = join(work, check.id + ".html");
    const result = spawnSync(
      "curl",
      [
        "--location",
        "--silent",
        "--show-error",
        "--connect-timeout",
        "10",
        "--max-time",
        "25",
        "--output",
        bodyFile,
        "--write-out",
        "%{http_code}",
        check.url,
      ],
      { encoding: "utf8" },
    );
    const body = await readFile(bodyFile, "utf8").catch(() => "");
    const status = Number(result.stdout.trim()) || 0;
    const ok =
      result.status === 0 &&
      status === 200 &&
      (typeof check.expected === "function"
        ? check.expected(body)
        : check.expected.test(body));
    const blocked = !ok && /CONNECT tunnel failed.*403/is.test(result.stderr);
    const entry = {
      id: check.id,
      url: check.url,
      httpStatus: status,
      outcome: ok ? "passed" : blocked ? "blocked" : "failed",
      transportExit: result.status,
      sha256: body ? createHash("sha256").update(body).digest("hex") : null,
      error:
        result.status === 0
          ? ok
            ? null
            : "HTTP status or expected content did not match"
          : result.stderr.trim().slice(0, 500) || "Transport failed",
    };
    report.checks.push(entry);
    if (ok) await writeFile(join(output, check.id + ".html"), body);
    console.log(
      `${ok ? "PASS" : blocked ? "BLOCKED" : "FAIL"} ${check.id}: HTTP ${status}${entry.error ? " — " + entry.error : ""}`,
    );
  }
  report.passed = report.checks.every((c) => c.outcome === "passed");
  await writeFile(
    join(output, "report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  if (!report.passed) process.exitCode = 1;
  console.log(
    "Evidence written to verification-results/external-release/report.json. Source text still requires substantive review.",
  );
} finally {
  await rm(work, { recursive: true, force: true });
}
