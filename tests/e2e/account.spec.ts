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
