import { test, expect } from "@playwright/test";
import { expectUrl } from "../fixtures/helpers";

test.describe("Customer Restricted Access", () => {
  // These tests verify that customer users cannot access admin pages
  // Requires customer authentication
  
  test.skip("customer cannot access /customers page", async ({ page }) => {
    await page.goto("/customers");
    // Should redirect to dashboard or show access denied
    await expectUrl(page, "/dashboard").catch(async () => {
      await expect(page.locator("text=access denied")).toBeVisible();
    });
  });

  test.skip("customer cannot access /customers/new page", async ({ page }) => {
    await page.goto("/customers/new");
    await expectUrl(page, "/dashboard").catch(async () => {
      await expect(page.locator("text=access denied")).toBeVisible();
    });
  });

  test.skip("customer cannot access /time-logs page", async ({ page }) => {
    await page.goto("/time-logs");
    await expectUrl(page, "/dashboard").catch(async () => {
      await expect(page.locator("text=access denied")).toBeVisible();
    });
  });

  test.skip("customer cannot access /settings page", async ({ page }) => {
    await page.goto("/settings");
    await expectUrl(page, "/dashboard").catch(async () => {
      await expect(page.locator("text=access denied")).toBeVisible();
    });
  });

  test.skip("customer cannot access /settings/users page", async ({ page }) => {
    await page.goto("/settings/users");
    await expectUrl(page, "/dashboard").catch(async () => {
      await expect(page.locator("text=access denied")).toBeVisible();
    });
  });

  test.skip("customer cannot access /settings/audit-log page", async ({ page }) => {
    await page.goto("/settings/audit-log");
    await expectUrl(page, "/dashboard").catch(async () => {
      await expect(page.locator("text=access denied")).toBeVisible();
    });
  });

  test.skip("customer cannot access /settings/reference-data page", async ({ page }) => {
    await page.goto("/settings/reference-data");
    await expectUrl(page, "/dashboard").catch(async () => {
      await expect(page.locator("text=access denied")).toBeVisible();
    });
  });

  test.skip("customer sidebar does not show admin links", async ({ page }) => {
    await page.goto("/dashboard");
    
    // Should NOT see these admin-only links
    await expect(page.getByRole("link", { name: /customers/i })).not.toBeVisible();
    await expect(page.getByRole("link", { name: /time logs/i })).not.toBeVisible();
    await expect(page.getByRole("link", { name: /settings/i })).not.toBeVisible();
  });

  test.skip("customer sidebar shows allowed links", async ({ page }) => {
    await page.goto("/dashboard");
    
    // Should see these customer-allowed links
    await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /contracts/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /requests/i })).toBeVisible();
  });
});
