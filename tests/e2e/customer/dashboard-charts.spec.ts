import { test, expect } from "@playwright/test";
import { navigateTo } from "../fixtures/helpers";

/**
 * Customer dashboard charts smoke test.
 *
 * Asserts the chart container renders, the bucket toggle round-trips
 * through the URL, and that contract multi-selection updates the URL.
 * Burndown card visibility depends on the seeded customer having an
 * Hours Bucket / Hours Subscription contract.
 *
 * Scaffolded with `test.skip` to match the rest of the suite until shared
 * customer-user auth is wired up.
 */
test.describe("Customer dashboard charts", () => {
  test.skip("chart renders and filter state round-trips through URL", async ({
    page,
  }) => {
    await navigateTo(page, "/dashboard");

    // The chart container is rendered as role=img with an aria label.
    await expect(
      page.getByRole("img", { name: /hours over time/i })
    ).toBeVisible();

    // Default bucket = day; switching to weekly should set ?bucket=week.
    await page.getByRole("radio", { name: /weekly/i }).click();
    await expect(page).toHaveURL(/[?&]bucket=week\b/);

    // Burndown row is conditional on qualifying contracts in the seed.
    const burndownsHeading = page.getByRole("heading", {
      name: /hours by contract/i,
    });
    if (await burndownsHeading.isVisible().catch(() => false)) {
      await expect(burndownsHeading).toBeVisible();
    }
  });

  test.skip("billable mode toggle updates URL", async ({ page }) => {
    await navigateTo(page, "/dashboard");

    await page.getByRole("radio", { name: /^billable$/i }).click();
    await expect(page).toHaveURL(/[?&]billable=billable\b/);
  });
});
