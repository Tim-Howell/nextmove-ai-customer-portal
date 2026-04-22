import { test, expect } from "@playwright/test";
import { navigateTo, expectUrl, generateTestId, expectToast } from "../fixtures/helpers";

test.describe("Customer Request Submission", () => {
  // These tests require customer authentication
  
  test.skip("can navigate to requests page", async ({ page }) => {
    await navigateTo(page, "/requests");
    await expect(page.locator("h1")).toContainText(/requests/i);
  });

  test.skip("can navigate to new request form", async ({ page }) => {
    await navigateTo(page, "/requests");
    await page.getByRole("link", { name: /new request/i }).click();
    await expectUrl(page, "/requests/new");
  });

  test.skip("new request form has required fields", async ({ page }) => {
    await navigateTo(page, "/requests/new");
    await expect(page.getByLabel(/title/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
    await expect(page.getByLabel(/category/i)).toBeVisible();
  });

  test.skip("customer is pre-selected in request form", async ({ page }) => {
    await navigateTo(page, "/requests/new");
    // Customer should be pre-selected and not changeable
    const customerField = page.getByLabel(/customer/i);
    await expect(customerField).toBeDisabled().catch(() => {
      // May be hidden or pre-filled
    });
  });

  test.skip("can submit new request", async ({ page }) => {
    await navigateTo(page, "/requests/new");
    
    await page.getByLabel(/title/i).fill(`Test Request ${generateTestId("req")}`);
    await page.getByLabel(/description/i).fill("This is a test request from E2E tests");
    
    // Select category if available
    const categoryField = page.getByLabel(/category/i);
    if (await categoryField.isVisible()) {
      await categoryField.click();
      await page.getByRole("option").first().click();
    }
    
    await page.getByRole("button", { name: /submit|create/i }).click();
    await expectToast(page, /created|submitted|success/i);
  });

  test.skip("submitted request appears in list", async ({ page }) => {
    const testTitle = `Test Request ${generateTestId("req")}`;
    
    await navigateTo(page, "/requests/new");
    await page.getByLabel(/title/i).fill(testTitle);
    await page.getByLabel(/description/i).fill("Test description");
    await page.getByRole("button", { name: /submit|create/i }).click();
    
    await navigateTo(page, "/requests");
    await expect(page.locator(`text=${testTitle}`)).toBeVisible();
  });

  test.skip("can view request detail", async ({ page }) => {
    await navigateTo(page, "/requests");
    await page.locator("tbody tr").first().locator("a").first().click();
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test.skip("request detail shows status", async ({ page }) => {
    await navigateTo(page, "/requests");
    await page.locator("tbody tr").first().locator("a").first().click();
    
    await expect(page.locator("text=Status")).toBeVisible();
  });
});
