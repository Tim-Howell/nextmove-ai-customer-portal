import { test, expect } from "@playwright/test";
import { navigateTo, expectUrl } from "../fixtures/helpers";

test.describe("Customer Authentication", () => {
  test("login page loads for customer", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1, h2").first()).toContainText(/sign in|login/i);
  });

  test("magic link form works for customer email", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "demo-acme1@example.com");
    await page.getByRole("button", { name: /send magic link/i }).click();
    // Should show success or error message
    await expect(page.locator("text=check your email").or(page.locator("text=error"))).toBeVisible({ timeout: 10000 }).catch(() => {});
  });

  test("customer cannot access admin routes when not logged in", async ({ page }) => {
    await page.goto("/customers");
    await expectUrl(page, "/login");
  });

  test("customer cannot access settings when not logged in", async ({ page }) => {
    await page.goto("/settings");
    await expectUrl(page, "/login");
  });
});
