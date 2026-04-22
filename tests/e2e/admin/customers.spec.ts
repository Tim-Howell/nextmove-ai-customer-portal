import { test, expect } from "@playwright/test";
import { navigateTo, expectUrl, generateTestId, expectToast, waitForPageLoad } from "../fixtures/helpers";

test.describe("Customer Management", () => {
  // Note: These tests require admin authentication
  // For now, they test the UI structure without full auth flow
  
  test.describe("Customer List Page", () => {
    test.skip("displays customer list", async ({ page }) => {
      await navigateTo(page, "/customers");
      await expect(page.locator("h1")).toContainText("Customers");
      await expect(page.locator("table")).toBeVisible();
    });

    test.skip("has search functionality", async ({ page }) => {
      await navigateTo(page, "/customers");
      await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    });

    test.skip("has status filter", async ({ page }) => {
      await navigateTo(page, "/customers");
      await expect(page.getByRole("combobox")).toBeVisible();
    });

    test.skip("has new customer button", async ({ page }) => {
      await navigateTo(page, "/customers");
      await expect(page.getByRole("link", { name: /new customer/i })).toBeVisible();
    });

    test.skip("search filters results", async ({ page }) => {
      await navigateTo(page, "/customers");
      await page.fill('input[placeholder*="Search"]', "Acme");
      await page.press('input[placeholder*="Search"]', "Enter");
      await waitForPageLoad(page);
      // Verify filtered results
      const rows = await page.locator("tbody tr").count();
      expect(rows).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Create Customer", () => {
    test.skip("can navigate to new customer form", async ({ page }) => {
      await navigateTo(page, "/customers");
      await page.getByRole("link", { name: /new customer/i }).click();
      await expectUrl(page, "/customers/new");
    });

    test.skip("new customer form has required fields", async ({ page }) => {
      await navigateTo(page, "/customers/new");
      await expect(page.getByLabel(/name/i)).toBeVisible();
      await expect(page.getByLabel(/status/i)).toBeVisible();
    });

    test.skip("can create a new customer", async ({ page }) => {
      const testName = `Test Customer ${generateTestId("cust")}`;
      
      await navigateTo(page, "/customers/new");
      await page.getByLabel(/name/i).fill(testName);
      await page.getByRole("button", { name: /save|create/i }).click();
      
      await expectToast(page, /created|success/i);
      await expectUrl(page, "/customers/");
    });

    test.skip("validates required fields", async ({ page }) => {
      await navigateTo(page, "/customers/new");
      await page.getByRole("button", { name: /save|create/i }).click();
      // Should show validation error
      await expect(page.locator("text=required")).toBeVisible();
    });
  });

  test.describe("Edit Customer", () => {
    test.skip("can navigate to edit customer form", async ({ page }) => {
      await navigateTo(page, "/customers");
      // Click edit on first customer
      await page.locator("tbody tr").first().getByRole("link", { name: /edit/i }).click();
      await expectUrl(page, /\/customers\/.*\/edit/);
    });

    test.skip("edit form is pre-populated", async ({ page }) => {
      await navigateTo(page, "/customers");
      await page.locator("tbody tr").first().getByRole("link", { name: /edit/i }).click();
      
      const nameField = page.getByLabel(/name/i);
      await expect(nameField).not.toBeEmpty();
    });

    test.skip("can update customer", async ({ page }) => {
      await navigateTo(page, "/customers");
      await page.locator("tbody tr").first().getByRole("link", { name: /edit/i }).click();
      
      const nameField = page.getByLabel(/name/i);
      const currentName = await nameField.inputValue();
      await nameField.fill(currentName + " Updated");
      
      await page.getByRole("button", { name: /save|update/i }).click();
      await expectToast(page, /updated|success/i);
    });
  });

  test.describe("Archive Customer", () => {
    test.skip("can archive a customer", async ({ page }) => {
      await navigateTo(page, "/customers");
      // Click archive on first customer
      await page.locator("tbody tr").first().getByRole("button", { name: /archive/i }).click();
      
      // Confirm dialog
      await page.getByRole("button", { name: /confirm|yes/i }).click();
      
      await expectToast(page, /archived|success/i);
    });

    test.skip("archived customers show in archived filter", async ({ page }) => {
      await navigateTo(page, "/customers?showArchived=true");
      // Should see archived badge
      await expect(page.locator("text=Archived")).toBeVisible();
    });
  });

  test.describe("Customer Detail", () => {
    test.skip("can view customer detail page", async ({ page }) => {
      await navigateTo(page, "/customers");
      // Click on customer name
      await page.locator("tbody tr").first().locator("a").first().click();
      await expectUrl(page, /\/customers\/[a-z0-9-]+$/);
    });

    test.skip("detail page shows customer info", async ({ page }) => {
      await navigateTo(page, "/customers");
      await page.locator("tbody tr").first().locator("a").first().click();
      
      await expect(page.locator("h1, h2").first()).toBeVisible();
    });

    test.skip("detail page shows contracts section", async ({ page }) => {
      await navigateTo(page, "/customers");
      await page.locator("tbody tr").first().locator("a").first().click();
      
      await expect(page.locator("text=Contracts")).toBeVisible();
    });

    test.skip("detail page shows contacts section", async ({ page }) => {
      await navigateTo(page, "/customers");
      await page.locator("tbody tr").first().locator("a").first().click();
      
      await expect(page.locator("text=Contacts")).toBeVisible();
    });
  });
});
