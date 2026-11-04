import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("app language and personalization persist through reload and appearance reset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/settings");
  await page.getByLabel("App language", { exact: true }).selectOption("mk");
  await expect(page.locator("html")).toHaveAttribute("lang", "mk");
  await expect(
    page.getByRole("heading", { name: "Малку повеќе ваше.", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".search-wrap")).toHaveAttribute(
    "data-mobile-placeholder",
    "Најдете мала поддршка…",
  );
  await page.locator(".theme-lavender").click();
  await page
    .getByRole("button", { name: "Крајбрежен мир", exact: true })
    .click();
  await page
    .getByLabel("Големина на текстот", { exact: true })
    .selectOption("large");
  await page.getByLabel("Ниво на движење", { exact: true }).selectOption("off");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "mk");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "lavender");
  await expect(page.locator("html")).toHaveAttribute(
    "data-background",
    "coast",
  );
  await expect(page.locator("html")).toHaveAttribute("data-text", "large");
  await expect(
    page.getByText(
      "Во ова издание нема push-известувања. TinySteps нема да бара дозвола за известувања.",
      { exact: true },
    ),
  ).toBeVisible();
  await page.goto("/profile");
  await expect(
    page.getByRole("heading", { name: "Малку за вас", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Продолжи со Google", exact: true }),
  ).toBeVisible();
  await page.goto("/first-365-days");
  await expect(
    page.getByRole("heading", { name: "Првите 365 дена", exact: true }),
  ).toBeVisible();
  await page.goto("/settings");
  await page
    .getByRole("button", { name: "Врати го почетниот изглед", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "sage");
  await expect(
    page.getByLabel("Јазик на апликацијата", { exact: true }),
  ).toHaveValue("mk");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
});
test("Macedonian search finds translated destinations and title follows the chosen language", async ({
  page,
}) => {
  await page.goto("/settings");
  await page.getByLabel("App language", { exact: true }).selectOption("mk");
  await page.goto("/");
  await page
    .getByRole("searchbox", { name: "Пребарај во TinySteps" })
    .fill("поставки");
  await page
    .locator(".search-results")
    .getByRole("link", { name: /Изглед и поставки/ })
    .click();
  await expect(page).toHaveURL(/settings/);
  await expect(page).toHaveTitle(/Малку повеќе ваше/);
});
test("account language uses revisioned storage, keeps guest preferences separate and preserves names", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "tinysteps-local-v1",
      JSON.stringify({
        version: 1,
        state: { preferences: { language: "en", theme: "peach" } },
      }),
    ),
  );
  const updates: Record<string, unknown>[] = [];
  await page.route("**/api/account", async (route) => {
    if (route.request().method() === "PATCH") {
      updates.push(route.request().postDataJSON());
      return route.fulfill({ json: { revision: updates.length + 1 } });
    }
    return route.fulfill({
      json: {
        id: "locale-account",
        displayName: "Home",
        email: "example@example.test",
        revision: 1,
        preferences: { language: "mk", firstYearLanguage: "mk" },
        progress: {},
        bookmarks: [],
      },
    });
  });
  await page.goto("/profile");
  await expect(page.locator(".profile-panel h2")).toHaveText(
    "Добредојдовте, Home.",
  );
  await page.goto("/settings");
  await page
    .getByLabel("Јазик на апликацијата", { exact: true })
    .selectOption("en");
  await expect(page.locator(".settings-footer").getByRole("status")).toHaveText(
    "Saved to your account.",
  );
  expect(updates.at(-1)).toMatchObject({
    kind: "preferences",
    preferences: { language: "en", firstYearLanguage: "en" },
  });
  const guest = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("tinysteps-local-v1")!).state.preferences,
  );
  expect(guest).toEqual({ language: "en", theme: "peach" });
});
test("Macedonian lessons, room guidance and save errors stay accessible at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    localStorage.setItem(
      "tinysteps-local-v1",
      JSON.stringify({
        version: 1,
        state: {
          preferences: {
            language: "mk",
            firstYearLanguage: "mk",
            textSize: "large",
          },
        },
      }),
    ),
  );
  for (const route of [
    "/care-academy",
    "/learning-map",
    "/care-academy/lessons/bath-water",
    "/safenest",
  ]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "mk");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(axe.violations).toEqual([]);
  }
  await page
    .getByRole("button", { name: "Истражувај Бања", exact: true })
    .click();
  await expect(page.locator(".nest-safer").first()).toContainText(
    "земете го детето со себе",
  );
  await page.route("**/api/account", async (route) =>
    route.request().method() === "PATCH"
      ? route.fulfill({
          status: 503,
          json: { error: "Your changes could not be saved." },
        })
      : route.fulfill({
          json: {
            id: "locale-error",
            displayName: "Ana",
            revision: 1,
            preferences: { language: "mk" },
            progress: {},
            bookmarks: [],
          },
        }),
  );
  await page.goto("/care-academy/lessons/sleep-space");
  await expect(
    page
      .locator(".lesson-panel")
      .getByRole("status")
      .filter({ hasText: "Промените не можеа да се зачуваат." }),
  ).toBeVisible();
});
