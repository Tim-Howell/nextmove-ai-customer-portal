import { test, expect } from "@playwright/test";
import { navigateTo, expectUrl } from "../fixtures/helpers";

test.describe("Customer Dashboard", () => {
  // These tests require customer authentication
  // Skipped until auth state setup is complete
  
  test.skip("dashboard loads for customer", async ({ page }) => {
    await navigateTo(page, "/dashboard");
    await expect(page.locator("h1, h2").first()).toContainText(/dashboard|welcome/i);
  });

  test.skip("shows customer organization name", async ({ page }) => {
    await navigateTo(page, "/dashboard");
    // Should show the customer's organization name
    await expect(page.locator("text=Acme")).toBeVisible();
  });

  test.skip("shows active contracts count", async ({ page }) => {
    await navigateTo(page, "/dashboard");
    await expect(page.locator("text=Active Contracts")).toBeVisible();
  });

  test.skip("shows hours used stat", async ({ page }) => {
    await navigateTo(page, "/dashboard");
    await expect(page.locator("text=Hours")).toBeVisible();
  });

  test.skip("shows open requests count", async ({ page }) => {
    await navigateTo(page, "/dashboard");
    await expect(page.locator("text=Requests")).toBeVisible();
  });

  test.skip("active contracts are clickable", async ({ page }) => {
    await navigateTo(page, "/dashboard");
    // Click on a contract link
    await page.locator('[data-testid="active-contracts"] a').first().click();
    await expectUrl(page, /\/contracts\//);
  });

  test.skip("new request button works", async ({ page }) => {
    await navigateTo(page, "/dashboard");
    await page.getByRole("link", { name: /new request/i }).click();
    await expectUrl(page, "/requests/new");
  });
});
