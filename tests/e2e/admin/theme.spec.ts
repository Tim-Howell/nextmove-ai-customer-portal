import { test, expect } from "@playwright/test";
import { navigateTo } from "../fixtures/helpers";

/**
 * Theme smoke test — verifies the runtime theme injection layer is wired
 * correctly. Asserts that the `--brand-primary` and `--brand-accent` CSS
 * variables resolve to non-empty values (admin-configured or brand default)
 * on the dashboard.
 *
 * Scaffolded with `test.skip` to match the rest of the e2e suite until
 * shared auth setup is wired up.
 */
test.describe("Theme injection", () => {
  test.skip("brand tokens resolve on the dashboard", async ({ page }) => {
    await navigateTo(page, "/dashboard");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const tokens = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        primary: styles.getPropertyValue("--brand-primary").trim(),
        accent: styles.getPropertyValue("--brand-accent").trim(),
        bg: styles.getPropertyValue("--brand-bg").trim(),
        fg: styles.getPropertyValue("--brand-fg").trim(),
      };
    });

    expect(tokens.primary).not.toBe("");
    expect(tokens.accent).not.toBe("");
    expect(tokens.bg).not.toBe("");
    expect(tokens.fg).not.toBe("");

    // Body should use the light background — Apple's #F5F5F7 is rgb(245, 245, 247).
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    expect(bg).toMatch(/rgb\(24[0-9], 24[0-9], 24[0-9]\)/);
  });
});
