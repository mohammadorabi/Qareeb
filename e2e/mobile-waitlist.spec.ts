import { expect, test } from "@playwright/test";

// The API is mocked: these tests never reach the Workiom webhook.

test.beforeEach(async ({ page }) => {
  await page.goto("/en#join");
});

test("empty form shows errors without sending", async ({ page }) => {
  let sent = false;
  await page.route("**/api/waitlist", (route) => {
    sent = true;
    return route.abort();
  });
  await page.getByRole("button", { name: "Join the waitlist" }).tap();
  await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible();
  expect(sent).toBe(false);
});

test("valid sign-up sends the page language and shows success", async ({ page }) => {
  let body: Record<string, unknown> = {};
  await page.route("**/api/waitlist", async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true } });
  });

  await page.locator('input[name="name"]').fill("Test Person");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.locator('select[name="country"]').selectOption("DE");
  await page.locator('input[name="phone"]').fill("+49 1512 3456789");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Join the waitlist" }).tap();

  await expect(page.getByRole("status")).toContainText("You're on the list");
  expect(body.locale).toBe("en");
});

test("rate-limited reply shows the retry message", async ({ page }) => {
  await page.route("**/api/waitlist", (route) =>
    route.fulfill({ status: 429, json: { ok: false, error: "rate_limited" } }),
  );
  await page.locator('input[name="name"]').fill("Test Person");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.locator('select[name="country"]').selectOption("DE");
  await page.locator('input[name="phone"]').fill("+49 1512 3456789");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Join the waitlist" }).tap();

  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
});
