import { spawn, spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { chromium } from "playwright";
const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
};
const next = "node_modules/next/dist/bin/next";
console.log("Building a production preview with no Supabase configuration.");
const build = spawnSync(process.execPath, [next, "build", "--webpack"], {
  env,
  encoding: "utf8",
});
if (build.status !== 0) {
  console.error("Missing-config build failed.");
  process.exit(1);
}
const server = spawn(
  process.execPath,
  [next, "start", "--hostname", "127.0.0.1", "--port", "3001"],
  { env, stdio: "ignore" },
);
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch("http://127.0.0.1:3001/")).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  assert.ok(ready, "Test preview did not start");
  browser = await chromium.launch({
    headless: true,
    ...(process.env.TINYSTEPS_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.TINYSTEPS_CHROMIUM_EXECUTABLE }
      : { channel: "chrome" }),
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:3001/");
  await page
    .getByRole("heading", { name: "Small steps, a brighter tomorrow." })
    .waitFor();
  await page.goto("http://127.0.0.1:3001/profile");
  const button = page.getByRole("button", { name: "Continue with Google" });
  await button.waitFor();
  assert.equal(await button.isDisabled(), true);
  await page
    .getByText("Account sign-in is temporarily unavailable.", { exact: false })
    .waitFor();
  await page.goto("http://127.0.0.1:3001/settings");
  await page.getByRole("button", { name: "Peach Warm & cozy" }).click();
  await page.reload();
  await page.waitForFunction(
    () => document.documentElement.dataset.theme === "peach",
  );
  await page.goto("http://127.0.0.1:3001/bookmarks");
  await page
    .getByRole("button", { name: "Save Care Academy", exact: true })
    .click();
  await page.reload();
  await page
    .getByRole("button", { name: "Remove Care Academy", exact: true })
    .waitFor();
  const response = await page.request.get("http://127.0.0.1:3001/api/account");
  assert.equal(response.status(), 200);
  assert.deepEqual(await response.json(), {
    guest: true,
    authAvailable: false,
  });
  const update = await page.request.patch("http://127.0.0.1:3001/api/account", {
    headers: { origin: "http://127.0.0.1:3000", host: "127.0.0.1:3000" },
    data: { kind: "profile", displayName: "Test" },
  });
  assert.equal(update.status(), 503);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: missing-config mobile production build loads, explains sign-in availability, preserves guest appearance/bookmarks, and returns safe API responses.",
  );
} catch (error) {
  console.error("Missing-config verification failed:", error.name);
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill();
}
