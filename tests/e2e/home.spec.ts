import { test, expect } from "@playwright/test";

test("home learning interest persists without a birth date and resumes real progress", async ({
  page,
}) => {
  await page.goto("/");
  const focus = page.getByRole("region", { name: "Your next little step" });
  await focus
    .getByLabel("What stage would you like to explore?")
    .selectOption("early");
  await expect(
    focus.getByText("There is no need to learn everything at once.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    focus.getByLabel("What stage would you like to explore?"),
  ).toHaveValue("early");
  await page.goto("/settings");
  await page.getByRole("button", { name: "Reset appearance" }).click();
  await page.goto("/");
  await expect(
    focus.getByLabel("What stage would you like to explore?"),
  ).toHaveValue("early");
  await focus.getByRole("link", { name: /Meet your learning space/ }).click();
  await page.getByRole("button", { name: "Next step" }).click();
  await page.goto("/");
  await expect(
    focus.getByRole("link", { name: /Continue at step 2 of 5/ }),
  ).toBeVisible();
});

test("home reflects loaded account data without inheriting guest interests", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "tinysteps-local-v1",
      JSON.stringify({
        state: { preferences: { learningStage: "later" } },
        version: 1,
      }),
    ),
  );
  await page.route("**/api/account", (route) =>
    route.fulfill({
      json: {
        id: "account-fixture",
        displayName: "Mila",
        revision: 1,
        preferences: { learningStage: "preparing" },
        progress: { completed: true, step: 4 },
        bookmarks: ["care-academy", "safenest"],
      },
    }),
  );
  await page.goto("/");
  await expect(
    page.getByText("Welcome back, Mila", { exact: true }),
  ).toBeVisible();
  const focus = page.getByRole("region", { name: "Your next little step" });
  await expect(
    focus.getByLabel("What stage would you like to explore?"),
  ).toHaveValue("preparing");
  await expect(
    focus.getByText("2 saved collections", { exact: true }),
  ).toBeVisible();
  await expect(
    focus.getByText("1 introduction completed", { exact: true }),
  ).toBeVisible();
});
