import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("map and text rooms agree; follow-up and reference reviews persist without safety scores", async ({
  page,
}) => {
  await page.goto("/safenest");
  await page
    .getByRole("button", { name: "Explore Bathroom", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Bathroom", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Rooms", exact: true })
      .getByRole("button", { name: /Bathroom/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByLabel("Review status: Water-safety guidance", { exact: true })
    .selectOption("follow-up");
  await expect(
    page.getByText("1 marked for follow-up", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Review status: Products and instructions", { exact: true })
    .selectOption("reviewed");
  await expect(
    page.getByText("1 / 12 references reviewed", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByLabel("Review status: Water-safety guidance", { exact: true }),
  ).toHaveValue("follow-up");
  await page
    .getByRole("button", { name: "Save SafeNest", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Remove SafeNest", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/settings");
  await page
    .getByRole("button", { name: "Reset appearance", exact: true })
    .click();
  await page.goto("/safenest");
  await expect(
    page.getByRole("heading", { name: "Bathroom", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Review status: Products and instructions", {
      exact: true,
    }),
  ).toHaveValue("reviewed");
  await page
    .getByLabel("Review status: Water-safety guidance", { exact: true })
    .selectOption("");
  await expect(
    page.getByText("0 marked for follow-up", { exact: true }),
  ).toBeVisible();
  await page.goto("/my-journey");
  await expect(
    page.getByRole("heading", { name: "1 reference reviewed", exact: true }),
  ).toBeVisible();
});

test("SafeNest stays accessible with large text, dark mode, keyboard and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/settings");
  await page.getByLabel("Text size").selectOption("large");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page.goto("/safenest");
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  const button = page
    .getByRole("navigation", { name: "Rooms", exact: true })
    .getByRole("button", { name: /Kitchen/ });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Kitchen", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Kitchen", exact: true }),
  ).toBeFocused();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact || ""),
    ),
  ).toEqual([]);
  expect(
    await page
      .locator(".nest-companion")
      .evaluate(
        (el) =>
          el.getAnimations().filter((a) => a.playState === "running").length,
      ),
  ).toBe(0);
});

test("account reference reviews are revisioned and remain separate from guest choices", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "tinysteps-local-v1",
      JSON.stringify({
        version: 1,
        state: {
          preferences: {
            safeNestRoom: "bathroom",
            safeNestChecks: { "bath-water": "reviewed" },
          },
        },
      }),
    ),
  );
  const updates: Record<string, unknown>[] = [];
  await page.route("**/api/account", async (route) => {
    if (route.request().method() === "PATCH") {
      updates.push(route.request().postDataJSON());
      await route.fulfill({ json: { revision: 2 } });
    } else
      await route.fulfill({
        json: {
          id: "nest-fixture",
          displayName: "Ana",
          revision: 1,
          preferences: { safeNestRoom: "kitchen", safeNestChecks: {} },
          progress: {},
          bookmarks: [],
        },
      });
  });
  await page.goto("/safenest");
  await expect(
    page.getByRole("heading", { name: "Kitchen", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("0 / 12 references reviewed", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Review status: Storage questions", { exact: true })
    .selectOption("follow-up");
  await expect.poll(() => updates.length).toBe(1);
  expect(updates[0]).toMatchObject({
    kind: "preferences",
    revision: 1,
    preferences: { safeNestChecks: { "kitchen-storage": "follow-up" } },
  });
  const guest = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("tinysteps-local-v1")!).state.preferences,
  );
  expect(guest.safeNestRoom).toBe("bathroom");
  expect(guest.safeNestChecks).toEqual({ "bath-water": "reviewed" });
});

test("failed account saves show the error and do not claim successful persistence", async ({
  page,
}) => {
  await page.route("**/api/account", (route) =>
    route.request().method() === "PATCH"
      ? route.fulfill({
          status: 503,
          json: { error: "Review choices could not be saved." },
        })
      : route.fulfill({
          json: {
            id: "nest-failure",
            displayName: "Ana",
            revision: 1,
            preferences: {},
            progress: {},
            bookmarks: [],
          },
        }),
  );
  await page.goto("/safenest");
  await page
    .getByLabel("Review status: Sleep-space guidance", { exact: true })
    .selectOption("reviewed");
  await expect(page.locator("#nest-room-panel").getByRole("status")).toHaveText(
    "Review choices could not be saved.",
  );
  await expect(
    page.getByText("Saved to your account.", { exact: true }),
  ).toHaveCount(0);
});
