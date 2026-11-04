import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("prepared offline guidance works on first offline navigation without caching private state", async ({
  page,
  context,
}) => {
  const writes: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "PATCH") writes.push(r.url());
  });
  await page.goto("/settings");
  await page.getByLabel("App language", { exact: true }).selectOption("mk");
  await page
    .getByLabel("Големина на текстот", { exact: true })
    .selectOption("large");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.goto("/not-previously-visited");
  await expect(
    page.getByRole("heading", { name: "Миг за пауза.", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/Промените во сметката не можат да се зачуваат/),
  ).toBeVisible();
  await expect(page.locator(".offline-reference details")).toHaveCount(12);
  await page.locator(".offline-reference summary").first().click();
  await expect(
    page.locator(".offline-reference details").first(),
  ).toContainText("на грб");
  await expect(page.locator("html")).toHaveAttribute("data-text", "large");
  expect(writes).toEqual([]);
  const cached = await page.evaluate(async () => {
    const paths: string[] = [];
    for (const name of await caches.keys()) {
      for (const request of await (await caches.open(name)).keys())
        paths.push(new URL(request.url).pathname);
    }
    return paths;
  });
  expect(cached).toContain("/offline");
  expect(
    cached.every(
      (path) =>
        path === "/offline" ||
        path.startsWith("/_next/static/") ||
        path.startsWith("/icons/"),
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".offline-reference button, .offline-reference input")
      .count(),
  ).toBe(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await context.setOffline(false);
  await page
    .getByRole("link", {
      name: "Обидете се да се вратите на почетната страница",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL("/");
});

test("security headers, install metadata and request boundaries are enforced", async ({
  request,
}) => {
  const html = await request.get("/settings");
  expect(html.headers()["x-content-type-options"]).toBe("nosniff");
  expect(html.headers()["x-frame-options"]).toBe("DENY");
  expect(html.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(html.headers()["content-security-policy"]).toContain(
    "object-src 'none'",
  );
  expect(html.headers()["content-security-policy"]).not.toContain(
    "unsafe-eval",
  );
  expect(html.headers()["x-powered-by"]).toBeUndefined();
  const sw = await request.get("/sw.js");
  expect(sw.headers()["cache-control"]).toContain("no-store");
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.display).toBe("standalone");
  expect(manifest.scope).toBe("/");
  expect(
    manifest.icons.some((i: { purpose: string }) => i.purpose === "maskable"),
  ).toBe(true);
  for (const icon of manifest.icons) {
    const png = await request.get(icon.src);
    expect(png.ok()).toBe(true);
    const bytes = await png.body();
    expect(bytes.subarray(1, 4).toString()).toBe("PNG");
    expect(bytes.readUInt32BE(16)).toBe(Number(icon.sizes.split("x")[0]));
  }
  const denied = await request.patch("/api/account", {
    headers: { Origin: "https://untrusted.example" },
    data: { kind: "profile", displayName: "Rejected" },
  });
  expect(denied.status()).toBe(403);
  expect(denied.headers()["cache-control"]).toContain("no-store");
  const malformed = await request.patch("/api/account", {
    headers: { Origin: "http://127.0.0.1:3000" },
    data: { kind: "preferences", user_id: "not-trusted" },
  });
  expect(malformed.status()).toBe(400);
});

test("worker updates wait for open tabs and preserve the old offline copy until activation", async ({
  browser,
}) => {
  const { createServer } = await import("node:http");
  const { readFile } = await import("node:fs/promises");
  const script = await readFile("public/sw.js", "utf8");
  let generation = 1;
  const server = createServer((req, res) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.url === "/sw.js") {
      res.setHeader("Content-Type", "application/javascript");
      res.end(
        script.replace(
          "tinysteps-public-1.8.0",
          `tinysteps-public-test-${generation}`,
        ),
      );
    } else if (req.url?.startsWith("/icons/")) {
      res.setHeader("Content-Type", "image/png");
      res.end("fixture icon");
    } else {
      res.setHeader("Content-Type", "text/html");
      res.end(
        `<!doctype html><title>Public offline fixture</title><h1>Public copy ${generation}</h1>`,
      );
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw Error("No test port");
  const origin = `http://127.0.0.1:${address.port}`;
  const context = await browser.newContext();
  try {
    const first = await context.newPage();
    await first.goto(origin);
    await first.evaluate(async () => {
      await navigator.serviceWorker.register("/sw.js", {
        updateViaCache: "none",
      });
      await navigator.serviceWorker.ready;
    });
    await first.reload();
    const second = await context.newPage();
    await second.goto(origin);
    generation = 2;
    await first.evaluate(async () => {
      const r = await navigator.serviceWorker.getRegistration();
      await r!.update();
    });
    await first.waitForFunction(
      async () => !!(await navigator.serviceWorker.getRegistration())?.waiting,
    );
    expect(await first.evaluate(() => caches.keys())).toEqual(
      expect.arrayContaining([
        "tinysteps-public-test-1",
        "tinysteps-public-test-2",
      ]),
    );
    await context.setOffline(true);
    await second.goto(origin + "/missing");
    await expect(second.getByRole("heading")).toHaveText("Public copy 1");
    await context.setOffline(false);
    await first.close();
    await second.close();
    const fresh = await context.newPage();
    await fresh.goto(origin);
    await fresh.waitForFunction(
      async () => !(await caches.keys()).includes("tinysteps-public-test-1"),
    );
    await context.setOffline(true);
    await fresh.goto(origin + "/missing");
    await expect(fresh.getByRole("heading")).toHaveText("Public copy 2");
  } finally {
    await context.close();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
