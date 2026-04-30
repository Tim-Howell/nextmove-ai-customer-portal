import { test, expect } from "@playwright/test";
import { navigateTo } from "../fixtures/helpers";

/**
 * Admin dashboard hours-by-staff chart smoke test.
 *
 * Asserts the chart container renders. With seeded data the chart should
 * surface at least one staff bar; we don't pin to specific names so the
 * test stays useful as the seed evolves.
 *
 * Scaffolded with `test.skip` to match the rest of the suite until shared
 * admin auth is wired up.
 */
test.describe("Admin dashboard hours by staff", () => {
  test.skip("chart container is present on dashboard", async ({ page }) => {
    await navigateTo(page, "/dashboard");

    await expect(
      page.getByRole("img", { name: /hours by staff person/i })
    ).toBeVisible();
  });
});
