import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("Studio lessons resume, preserve explored state and appear in the map and journey", async ({
  page,
}) => {
  await page.goto("/care-academy");
  await page.getByRole("link", { name: "Start a lesson", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A clear place to sleep", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Compare", exact: true }),
  ).toBeVisible();
  await page.locator(".nest-practice-options button").first().click();
  await expect(page.locator(".lesson-feedback")).toContainText(
    "retains the hazard",
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Mark lesson as explored", exact: true })
    .click();
  await page
    .getByRole("button", { name: "1. Understand", exact: true })
    .click();
  await page.goto("/settings");
  await page
    .getByRole("button", { name: "Reset appearance", exact: true })
    .click();
  await page.goto("/learning-map");
  await expect(page.locator('[data-status="Explored"]')).toHaveCount(1);
  await page.goto("/my-journey");
  await expect(
    page.getByRole("heading", {
      name: "1 Studio lesson explored",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("/care-academy/lessons/sleep-space");
  await page
    .getByRole("button", { name: "3. Carry it forward", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Mark lesson as not explored", exact: true })
    .click();
  await page.goto("/learning-map");
  await expect(page.locator('[data-status="Explored"]')).toHaveCount(0);
});
test("lesson and map work with keyboard, reduced motion and large text at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/settings");
  await page.getByLabel("Text size").selectOption("large");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  for (const route of ["/learning-map", "/care-academy/lessons/bath-water"]) {
    await page.goto(route);
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
  await page.getByRole("button", { name: "2. Compare", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Compare", exact: true }),
  ).toBeFocused();
  await expect(
    page.locator(".learning-companion").locator("img"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Dismiss this companion tip", exact: true })
    .click();
  await expect(page.locator(".learning-companion")).toHaveCount(0);
});
test("account lessons stay isolated from guest state and use revisioned saves", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "tinysteps-local-v1",
      JSON.stringify({
        version: 1,
        state: {
          preferences: {
            learningProgress: { furniture: { step: 2, completed: true } },
          },
        },
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
        id: "studio-account",
        displayName: "Ana",
        revision: 1,
        preferences: {
          activeLearningLesson: "bath-water",
          learningProgress: { "bath-water": { step: 1, completed: false } },
        },
        progress: {},
        bookmarks: [],
      },
    });
  });
  await page.goto("/learning-map");
  await expect(page.locator('[data-status="Explored"]')).toHaveCount(0);
  await page
    .getByRole("link", { name: "Return to your lesson", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Compare", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Mark lesson as explored", exact: true })
    .click();
  await expect(
    page
      .locator(".lesson-panel")
      .getByRole("status")
      .filter({ hasText: "Saved to your account." }),
  ).toBeVisible();
  expect(updates.at(-1)).toMatchObject({
    kind: "preferences",
    preferences: {
      learningProgress: { "bath-water": { step: 2, completed: true } },
    },
  });
  const guest = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("tinysteps-local-v1")!).state.preferences
        .learningProgress,
  );
  expect(guest).toEqual({ furniture: { step: 2, completed: true } });
});
test("lesson save failures stay visible and unknown lessons return 404", async ({
  page,
}) => {
  await page.route("**/api/account", async (route) =>
    route.request().method() === "PATCH"
      ? route.fulfill({
          status: 503,
          json: { error: "Learning choices could not be saved." },
        })
      : route.fulfill({
          json: {
            id: "studio-failure",
            displayName: "Ana",
            revision: 1,
            preferences: {},
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
      .filter({ hasText: "Learning choices could not be saved." }),
  ).toBeVisible();
  const response = await page.goto("/care-academy/lessons/not-a-lesson");
  expect(response?.status()).toBe(404);
});

test("public guidance stays readable while account progress is loading", async ({
  page,
}) => {
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/account", async (route) => {
    await pending;
    await route.fulfill({ json: { guest: true } });
  });
  await page.goto("/care-academy/lessons/sleep-space");
  await expect(
    page.getByText("Loading your lesson…", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".nest-safer")).toContainText("back");
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeDisabled();
  release();
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeEnabled();
});
