import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("day and week jumps open chapters and appearance reset preserves reading", async ({
  page,
}) => {
  await page.goto("/first-365-days");
  await page
    .getByLabel("Find a chapter by", { exact: true })
    .selectOption("day");
  await page.getByLabel("Day number", { exact: true }).fill("365");
  await page.getByRole("button", { name: "Open chapter", exact: true }).click();
  await expect(page.getByLabel("Explore a month", { exact: true })).toHaveValue(
    "12",
  );
  await page
    .getByRole("button", { name: "Mark chapter as explored", exact: true })
    .click();
  await page.goto("/settings");
  await page
    .getByRole("button", { name: "Reset appearance", exact: true })
    .click();
  await page.goto("/first-365-days");
  await expect(page.getByLabel("Explore a month", { exact: true })).toHaveValue(
    "12",
  );
  await expect(page.locator("progress")).toHaveAttribute("value", "1");
  await page.goto("/my-journey");
  await expect(
    page.getByRole("heading", {
      name: "1 first-year chapter explored",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("/first-365-days");
  await page.getByLabel("Week number", { exact: true }).fill("1");
  await page.getByRole("button", { name: "Open chapter", exact: true }).click();
  await expect(page.getByLabel("Explore a month", { exact: true })).toHaveValue(
    "0",
  );
  await expect(
    page.getByRole("button", { name: "Previous month", exact: true }),
  ).toBeDisabled();
});

test("first year navigates, persists reading, and bookmarks the collection", async ({
  page,
}) => {
  await page.goto("/first-365-days");
  await page.getByLabel("Explore a month", { exact: true }).selectOption("6");
  await expect(
    page.getByRole("heading", { name: "A moment to reflect" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mark chapter as explored", exact: true })
    .click();
  await expect(page.locator("progress")).toHaveAttribute("value", "1");
  await page
    .getByRole("button", { name: "Save First 365 Days", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Remove First 365 Days", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByLabel("Explore a month", { exact: true })).toHaveValue(
    "6",
  );
  await expect(
    page.getByRole("button", {
      name: "Mark chapter as unexplored",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  await expect(page.getByLabel("Explore a month", { exact: true })).toHaveValue(
    "7",
  );
  await page.goto("/bookmarks");
  await expect(
    page.getByRole("button", { name: "Remove First 365 Days", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("Macedonian chapters and large text work on mobile with keyboard navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/settings");
  await page.getByLabel("Text size").selectOption("large");
  await page.goto("/first-365-days");
  await page.getByLabel("Chapter language").selectOption("mk");
  await expect(
    page.getByRole("heading", { name: "Првите 365 дена", exact: true }),
  ).toBeVisible();
  const month = page.getByLabel("Истражете еден месец", { exact: true });
  await month.selectOption("12");
  await expect(
    page.getByRole("button", { name: "Следен месец", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: "Една година, многу почетоци" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator(".first-year")).toHaveAttribute("lang", "mk");
  await page
    .getByRole("button", { name: "Претходен месец", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(month).toHaveValue("11");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact || ""),
    ),
  ).toEqual([]);
});

test("account reading state stays separate from guest state and uses revisioned saves", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "tinysteps-local-v1",
      JSON.stringify({
        version: 1,
        state: { preferences: { firstYearMonth: 9, firstYearRead: [9] } },
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
          id: "year-fixture",
          displayName: "Ana",
          revision: 1,
          preferences: { firstYearMonth: 2, firstYearRead: [] },
          progress: {},
          bookmarks: [],
        },
      });
  });
  await page.goto("/first-365-days");
  await expect(page.getByLabel("Explore a month", { exact: true })).toHaveValue(
    "2",
  );
  await expect(page.locator("progress")).toHaveAttribute("value", "0");
  await page
    .getByRole("button", { name: "Mark chapter as explored", exact: true })
    .click();
  await expect.poll(() => updates.length).toBe(1);
  expect(updates[0]).toMatchObject({
    kind: "preferences",
    revision: 1,
    preferences: { firstYearRead: [2] },
  });
  const guest = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("tinysteps-local-v1")!).state.preferences,
  );
  expect(guest.firstYearRead).toEqual([9]);
});
