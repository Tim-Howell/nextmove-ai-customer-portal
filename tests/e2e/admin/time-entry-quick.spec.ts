import { test, expect } from "@playwright/test";
import { navigateTo, expectToast, generateTestId } from "../fixtures/helpers";

/**
 * Quick Time Entry — admin/staff path.
 *
 * These tests follow the project's existing E2E pattern: they are scaffolded
 * with `test.skip` until shared auth setup is wired up. When that lands,
 * remove the `.skip` and they'll exercise the real flow.
 */
test.describe("Quick Time Entry (sidebar)", () => {
  test.skip("Submit Time section is visible to admin with both buttons", async ({
    page,
  }) => {
    await navigateTo(page, "/dashboard");
    await expect(page.getByText(/Submit Time/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Quick Entry/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Detailed Entry/i })).toBeVisible();
  });

  test.skip("Quick Entry submits a valid entry and shows a toast", async ({
    page,
  }) => {
    await navigateTo(page, "/dashboard");
    await page.getByRole("button", { name: /Quick Entry/i }).click();

    // Modal appears
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Quick Time Entry/i })
    ).toBeVisible();

    // Fill the reduced field set
    await page.getByLabel(/Customer/i).click();
    await page.getByRole("option").first().click();

    await page.getByLabel(/Contract/i).click();
    await page.getByRole("option").first().click();

    await page.getByLabel(/Hours/i).fill("1.5");
    await page
      .getByLabel(/Description/i)
      .fill(`Quick ${generateTestId("qte")}`);

    await page.getByLabel(/Category/i).click();
    await page.getByRole("option").first().click();

    await page.getByRole("button", { name: /Log Time/i }).click();
    await expectToast(page, /created/i);
  });

  test.skip("Quick Entry pre-fills customer/contract on next open", async ({
    page,
  }) => {
    // First submission — establishes the last-used preference
    await navigateTo(page, "/dashboard");
    await page.getByRole("button", { name: /Quick Entry/i }).click();
    await page.getByLabel(/Customer/i).click();
    await page.getByRole("option").first().click();
    await page.getByLabel(/Contract/i).click();
    await page.getByRole("option").first().click();
    await page.getByLabel(/Hours/i).fill("1");
    await page.getByLabel(/Category/i).click();
    await page.getByRole("option").first().click();
    await page.getByRole("button", { name: /Log Time/i }).click();
    await expectToast(page, /created/i);

    // Re-open — customer + contract should be pre-filled
    await page.getByRole("button", { name: /Quick Entry/i }).click();
    await expect(page.getByLabel(/Customer/i)).not.toContainText(
      /Select customer/i
    );
    await expect(page.getByLabel(/Contract/i)).not.toContainText(
      /Select contract/i
    );
  });

  test.skip("Detailed Entry navigates to the existing form", async ({
    page,
  }) => {
    await navigateTo(page, "/dashboard");
    await page.getByRole("link", { name: /Detailed Entry/i }).click();
    await expect(page).toHaveURL(/\/time-logs\/new/);
  });
});
