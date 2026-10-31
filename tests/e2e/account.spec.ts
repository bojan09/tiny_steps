import { test, expect } from "@playwright/test";
test("failed Google callback renders without hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/profile?auth=failed");
  await expect(
    page.getByRole("button", { name: "Continue with Google" }),
  ).toBeVisible();
  await expect(
    page.getByText("Sign-in was not completed.", { exact: false }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("guest status is normal and cross-origin updates are rejected", async ({
  request,
}) => {
  const response = await request.get("/api/account");
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ guest: true });
  const blocked = await request.patch("/api/account", {
    headers: { origin: "https://other.example" },
    data: { kind: "profile", displayName: "Wrong" },
  });
  expect(blocked.status()).toBe(403);
});

test("custom palette and new scene persist on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/settings");
  await page.getByRole("button", { name: "Custom Your own touch" }).click();
  await page.getByLabel("Your accent color").fill("#ffcc00");
  await page
    .getByRole("button", { name: "Morning meadow", exact: true })
    .click();
  await page.reload();
  await expect(page.getByLabel("Your accent color")).toHaveValue("#ffcc00");
  await expect(page.locator("html")).toHaveAttribute(
    "data-background",
    "meadow",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("account never reports saved while a newer preference change is pending", async ({
  page,
}) => {
  const updates: Record<string, unknown>[] = [];
  let releaseFirst!: () => void, releaseSecond!: () => void;
  const first = new Promise<void>((resolve) => {
    releaseFirst = resolve;
  });
  const second = new Promise<void>((resolve) => {
    releaseSecond = resolve;
  });
  await page.route("**/api/account", async (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({
        json: {
          id: "save-race",
          displayName: "Ana",
          revision: 1,
          preferences: {},
          progress: {},
          bookmarks: [],
        },
      });
    updates.push(route.request().postDataJSON());
    const index = updates.length;
    await (index === 1 ? first : second);
    await route.fulfill({ json: { revision: index + 1 } });
  });
  try {
    await page.goto("/settings");
    await page.getByRole("button", { name: "Peach Warm & cozy" }).click();
    await expect.poll(() => updates.length).toBe(1);
    await page.evaluate(() => {
      const events: string[] = [];
      (window as unknown as { savedEvents: string[] }).savedEvents = events;
      new MutationObserver(() => {
        for (const node of document.querySelectorAll('[role="status"]'))
          if (node.textContent === "Saved to your account.")
            events.push(node.textContent);
      }).observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    });
    await page.getByLabel("Text size").selectOption("large");
    releaseFirst();
    await expect.poll(() => updates.length).toBe(2);
    expect(
      await page.evaluate(
        () => (window as unknown as { savedEvents: string[] }).savedEvents,
      ),
    ).toEqual([]);
    expect(updates[1]).toMatchObject({
      kind: "preferences",
      revision: 2,
      preferences: { textSize: "large" },
    });
    releaseSecond();
    await expect(
      page.getByRole("status").filter({ hasText: "Saved to your account." }),
    ).toBeVisible();
  } finally {
    releaseFirst();
    releaseSecond();
  }
});
