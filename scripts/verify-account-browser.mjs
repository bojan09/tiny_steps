import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { chromium } from "playwright";
import { loadLocalEnv, safeFailure } from "./database.mjs";
loadLocalEnv();
const base = "http://127.0.0.1:3000",
  url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const admin = createClient(url, process.env.SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
let id, browser;
let stage = "create identity";
try {
  const email = "tinysteps-browser-" + randomUUID() + "@example.invalid",
    password = randomUUID() + randomUUID();
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: "Account test" },
  });
  assert.equal(created.error, null);
  id = created.data.user.id;
  let cookies = [];
  const auth = createServerClient(url, key, {
    cookies: {
      getAll: () => cookies,
      setAll: (values) => {
        cookies = values;
      },
    },
  });
  assert.equal(
    (await auth.auth.signInWithPassword({ email, password })).error,
    null,
  );
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext();
  await context.addCookies(
    cookies.map((c) => ({
      name: c.name,
      value: c.value,
      url: base,
      sameSite: "Lax",
    })),
  );
  console.log("Session cookie count:", cookies.length);
  const status = await context.request.get(base + "/api/account");
  const body = await status.json();
  console.log("Account endpoint:", status.status(), {
    guest: body.guest,
    error: body.error,
    hasId: !!body.id,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", async (response) => {
    if (
      response.url() === base + "/api/account" &&
      response.request().method() === "PATCH"
    ) {
      const b = await response.json();
      console.log("Update status:", response.status(), b.error || "ok");
    }
  });
  stage = "load profile";
  await page.goto(base + "/profile");
  await page.getByRole("button", { name: "Sign out", exact: true }).waitFor();
  stage = "edit name";
  await page.getByLabel("What should we call you?").fill("Browser verified");
  await page.getByRole("button", { name: "Save name" }).click();
  await page
    .getByRole("heading", { name: "Welcome, Browser verified." })
    .waitFor();
  stage = "save appearance";
  await page.goto(base + "/settings");
  await page.getByRole("button", { name: "Peach Warm & cozy" }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "Saved to your account." })
    .waitFor();
  stage = "reload appearance";
  await page.reload();
  await page.getByRole("button", { name: "Peach Warm & cozy" }).waitFor();
  await page.waitForFunction(
    () => document.documentElement.dataset.theme === "peach",
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("tinysteps-local-v1")),
    null,
    "Account data must not persist as guest settings",
  );
  stage = "bookmark";
  await page.goto(base + "/bookmarks");
  await page
    .getByRole("button", { name: "Save Care Academy", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Remove Care Academy", exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("button", { name: "Remove Care Academy", exact: true })
    .waitFor();
  stage="progress";
  await page.goto(base+"/care-academy/getting-started");
  await page.getByText("Browser verified",{exact:true}).waitFor();
  for(let i=0;i<4;i++)await page.getByRole("button",{name:"Next step"}).click();
  const savedProgress=page.waitForResponse(r=>r.url()===base+"/api/account"&&r.request().method()==="PATCH"&&r.request().postDataJSON()?.kind==="progress"&&r.status()===200);
  await page.getByRole("button",{name:"Finish introduction"}).click();await savedProgress;
  await page.goto(base+"/my-journey");await page.getByText("1 introduction completed",{exact:true}).waitFor();
  await page.goto(base + "/profile");
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page
    .getByRole("button", { name: "Continue with Google", exact: true })
    .waitFor();
  await page.goto(base + "/settings");
  await page.waitForFunction(
    () => document.documentElement.dataset.theme === "sage",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: real authenticated profile, preference persistence, bookmark persistence, guest isolation and sign-out. Google consent is a separate user check.",
  );
} catch (error) {
  console.error(
    "Browser verification failed:",
    stage,
    error?.name || "unknown",
  );
  process.exitCode = 1;
} finally {
  await browser?.close();
  if (id) {
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) {
      safeFailure(error);
    } else console.log("Disposable browser-test identity removed.");
  }
}
