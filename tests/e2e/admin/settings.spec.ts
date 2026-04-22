import { test, expect } from "@playwright/test";
import { navigateTo, expectUrl, expectToast, waitForPageLoad } from "../fixtures/helpers";

test.describe("Settings Pages", () => {
  test.describe("Settings Navigation", () => {
    test.skip("settings page loads", async ({ page }) => {
      await navigateTo(page, "/settings");
      await expect(page.locator("h1, h2").first()).toContainText(/settings/i);
    });

    test.skip("has navigation tabs", async ({ page }) => {
      await navigateTo(page, "/settings");
      await expect(page.getByRole("link", { name: /general/i })).toBeVisible();
      await expect(page.getByRole("link", { name: /users/i })).toBeVisible();
      await expect(page.getByRole("link", { name: /reference/i })).toBeVisible();
    });
  });

  test.describe("General Settings", () => {
    test.skip("general settings page loads", async ({ page }) => {
      await navigateTo(page, "/settings");
      await expect(page.locator("text=General")).toBeVisible();
    });

    test.skip("can toggle demo data visibility", async ({ page }) => {
      await navigateTo(page, "/settings");
      const toggle = page.getByLabel(/demo data/i);
      await toggle.click();
      await expectToast(page, /updated|saved/i);
    });
  });

  test.describe("Staff Users", () => {
    test.skip("staff users page loads", async ({ page }) => {
      await navigateTo(page, "/settings/users");
      await expect(page.locator("h2, h3").first()).toContainText(/user/i);
      await expect(page.locator("table")).toBeVisible();
    });

    test.skip("has invite user button", async ({ page }) => {
      await navigateTo(page, "/settings/users");
      await expect(page.getByRole("link", { name: /invite/i })).toBeVisible();
    });

    test.skip("can navigate to invite form", async ({ page }) => {
      await navigateTo(page, "/settings/users");
      await page.getByRole("link", { name: /invite/i }).click();
      await expectUrl(page, "/settings/users/invite");
    });

    test.skip("invite form has required fields", async ({ page }) => {
      await navigateTo(page, "/settings/users/invite");
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/role/i)).toBeVisible();
    });

    test.skip("has role filter", async ({ page }) => {
      await navigateTo(page, "/settings/users");
      await expect(page.getByRole("combobox")).toBeVisible();
    });

    test.skip("can change user role", async ({ page }) => {
      await navigateTo(page, "/settings/users");
      // Find role dropdown in table
      const roleSelect = page.locator("tbody tr").first().getByRole("combobox");
      await roleSelect.click();
      await page.getByRole("option").first().click();
    });

    test.skip("can toggle user active status", async ({ page }) => {
      await navigateTo(page, "/settings/users");
      const toggle = page.locator("tbody tr").first().getByRole("switch");
      await toggle.click();
    });
  });

  test.describe("Customer Users", () => {
    test.skip("customer users page loads", async ({ page }) => {
      await navigateTo(page, "/settings/customer-users");
      await expect(page.locator("h2, h3").first()).toContainText(/customer/i);
    });

    test.skip("shows customer association", async ({ page }) => {
      await navigateTo(page, "/settings/customer-users");
      await expect(page.locator("table")).toBeVisible();
    });
  });

  test.describe("Reference Data", () => {
    test.skip("reference data page loads", async ({ page }) => {
      await navigateTo(page, "/settings/reference-data");
      await expect(page.locator("h2, h3").first()).toContainText(/reference/i);
    });

    test.skip("shows reference value categories", async ({ page }) => {
      await navigateTo(page, "/settings/reference-data");
      await expect(page.locator("text=Status")).toBeVisible();
    });

    test.skip("can add reference value", async ({ page }) => {
      await navigateTo(page, "/settings/reference-data");
      await page.getByRole("button", { name: /add/i }).first().click();
      // Fill form
      await page.getByLabel(/value/i).fill("Test Value");
      await page.getByRole("button", { name: /save/i }).click();
      await expectToast(page, /created|success/i);
    });
  });

  test.describe("Portal Branding", () => {
    test.skip("portal branding page loads", async ({ page }) => {
      await navigateTo(page, "/settings/portal-branding");
      await expect(page.locator("h2, h3").first()).toContainText(/branding/i);
    });

    test.skip("can update organization name", async ({ page }) => {
      await navigateTo(page, "/settings/portal-branding");
      await page.getByLabel(/organization name/i).fill("Test Organization");
      await page.getByRole("button", { name: /save/i }).click();
      await expectToast(page, /updated|saved/i);
    });
  });

  test.describe("Audit Log", () => {
    test.skip("audit log page loads", async ({ page }) => {
      await navigateTo(page, "/settings/audit-log");
      await expect(page.locator("h2, h3").first()).toContainText(/audit/i);
    });

    test.skip("shows audit entries", async ({ page }) => {
      await navigateTo(page, "/settings/audit-log");
      await expect(page.locator("table")).toBeVisible();
    });

    test.skip("has table filter", async ({ page }) => {
      await navigateTo(page, "/settings/audit-log");
      await expect(page.getByRole("combobox")).toBeVisible();
    });

    test.skip("has date range filter", async ({ page }) => {
      await navigateTo(page, "/settings/audit-log");
      await expect(page.locator('input[type="date"]')).toBeVisible();
    });
  });
});
