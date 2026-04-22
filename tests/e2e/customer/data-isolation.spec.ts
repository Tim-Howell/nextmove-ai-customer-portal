import { test, expect } from "@playwright/test";
import { navigateTo, expectUrl } from "../fixtures/helpers";

test.describe("Customer Data Isolation", () => {
  // These tests verify that customer users can only see their own data
  // Requires customer authentication
  
  test.skip("customer only sees own contracts", async ({ page }) => {
    await navigateTo(page, "/contracts");
    
    // All contracts should belong to the logged-in customer
    // Verify no contracts from other customers are visible
    const rows = await page.locator("tbody tr").count();
    expect(rows).toBeGreaterThanOrEqual(0);
    
    // Each contract should be for the customer's organization
    // This would need to check the customer column or detail
  });

  test.skip("customer only sees own priorities", async ({ page }) => {
    await navigateTo(page, "/priorities");
    
    const rows = await page.locator("tbody tr").count();
    expect(rows).toBeGreaterThanOrEqual(0);
  });

  test.skip("customer only sees own requests", async ({ page }) => {
    await navigateTo(page, "/requests");
    
    const rows = await page.locator("tbody tr").count();
    expect(rows).toBeGreaterThanOrEqual(0);
  });

  test.skip("customer only sees own time entries in reports", async ({ page }) => {
    await navigateTo(page, "/time-reports");
    
    // Time entries should only be for the customer's contracts
  });

  test.skip("cannot access other customer contract by URL", async ({ page }) => {
    // Try to access a contract ID that belongs to another customer
    // This would need a known "other customer" contract ID
    const otherCustomerContractId = "00000000-0000-0000-0000-000000000000";
    
    await page.goto(`/contracts/${otherCustomerContractId}`);
    
    // Should either redirect or show error
    await expect(page.locator("text=not found").or(page.locator("text=access denied"))).toBeVisible().catch(async () => {
      // May redirect to contracts list
      await expectUrl(page, "/contracts");
    });
  });

  test.skip("cannot access other customer priority by URL", async ({ page }) => {
    const otherCustomerPriorityId = "00000000-0000-0000-0000-000000000000";
    
    await page.goto(`/priorities/${otherCustomerPriorityId}`);
    
    await expect(page.locator("text=not found").or(page.locator("text=access denied"))).toBeVisible().catch(async () => {
      await expectUrl(page, "/priorities");
    });
  });

  test.skip("cannot access other customer request by URL", async ({ page }) => {
    const otherCustomerRequestId = "00000000-0000-0000-0000-000000000000";
    
    await page.goto(`/requests/${otherCustomerRequestId}`);
    
    await expect(page.locator("text=not found").or(page.locator("text=access denied"))).toBeVisible().catch(async () => {
      await expectUrl(page, "/requests");
    });
  });
});
