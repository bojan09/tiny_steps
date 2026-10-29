import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("dashboard, search and separate account routes work", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Small steps, a brighter tomorrow." }),
  ).toBeVisible();
  await page.getByRole("searchbox").fill("settings");
  await page
    .locator(".search-results")
    .getByRole("link", { name: /Appearance & settings/ })
    .click();
  await expect(page).toHaveURL(/settings/);
  await page.goto("/profile");
  await expect(
    page.getByRole("heading", { name: "A little about you" }),
  ).toBeVisible();
});
test("settings persist, reset and respect motion choice", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: "Peach Warm & cozy" }).click();
  await page.getByLabel("Motion level").selectOption("off");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "peach");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.getByRole("button", { name: "Reset appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "sage");
});
test("responsive layouts have no horizontal overflow", async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 375)
      await expect(
        page
          .getByRole("navigation", { name: "Mobile navigation" })
          .getByRole("link"),
      ).toHaveCount(5);
  }
});
test("orientation records real local progress", async ({ page }) => {
  await page.goto("/care-academy/getting-started");
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "Next step" }).click();
  await page.getByRole("button", { name: "Finish introduction" }).click();
  await page.goto("/my-journey");
  await expect(page.getByText("1 introduction completed")).toBeVisible();
});
test("core pages have no serious accessibility violations", async ({
  page,
}) => {
  for (const route of ["/", "/settings", "/profile", "/care-academy"]) {
    await page.goto(route);
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
