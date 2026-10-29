import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("mobile navigation closes with Escape and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Site navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator(".sidebar")).toHaveAttribute("inert", "");
});
test("all published destinations resolve without console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of [
    "/",
    "/care-academy",
    "/first-365-days",
    "/safenest",
    "/everyday-guides",
    "/parent-academy",
    "/learning-map",
    "/ai-assistant",
    "/my-journey",
    "/bookmarks",
    "/downloads",
    "/profile",
    "/settings",
    "/help",
    "/offline",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});
test("bookmarks persist and can be removed", async ({ page }) => {
  await page.goto("/bookmarks");
  await page
    .getByRole("button", { name: "Save Care Academy", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Remove Care Academy", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Remove Care Academy", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText("0 saved collections");
});
test("corrupt browser preferences recover safely", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("tinysteps-local-v1", "{broken"),
  );
  await page.goto("/settings");
  await expect(
    page.getByRole("button", { name: "Sage Calm & natural" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "sage");
});
test("dark mode meets core contrast requirements", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  for (const route of ["/settings", "/", "/profile"]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact || ""),
      ),
    ).toEqual([]);
  }
});
test("offline fallback works and private routes are never cached", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.goto("/unavailable-offline");
  await expect(
    page.getByRole("heading", { name: "A moment to pause." }),
  ).toBeVisible();
  await context.setOffline(false);
  const paths = await page.evaluate(async () => {
    const names = await caches.keys();
    const paths: string[] = [];
    for (const name of names) {
      const cache = await caches.open(name);
      for (const request of await cache.keys())
        paths.push(new URL(request.url).pathname);
    }
    return paths;
  });
  expect(paths).toContain("/offline");
  expect(
    paths.some(
      (p) =>
        p.startsWith("/api/") || p.startsWith("/auth/") || p === "/profile",
    ),
  ).toBe(false);
});

test("blocked browser storage does not break appearance controls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Storage unavailable", "QuotaExceededError");
    };
  });
  await page.goto("/settings");
  await page.getByRole("button", { name: "Peach Warm & cozy" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "peach");
  expect(errors).toEqual([]);
});
test("large text and reduced motion remain usable on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/settings");
  await page.getByLabel("Text size").selectOption("large");
  for (const route of [
    "/settings",
    "/",
    "/care-academy/getting-started",
    "/profile",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  expect(
    await page
      .locator(".hero-companion")
      .evaluate(
        (el) =>
          el.getAnimations().filter((a) => a.playState === "running").length,
      ),
  ).toBe(0);
});
