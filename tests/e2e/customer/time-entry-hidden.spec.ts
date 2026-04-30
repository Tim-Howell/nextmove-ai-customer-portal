import { test, expect } from "@playwright/test";
import { navigateTo } from "../fixtures/helpers";

/**
 * Customer users SHALL NOT see the Submit Time sidebar section, Quick Entry
 * button, or Detailed Entry button. Time entry is staff-only.
 *
 * Scaffolded with `test.skip` to match the project's current E2E pattern.
 */
test.describe("Quick Time Entry (customer hidden)", () => {
  test.skip("Submit Time section is absent for customer_user", async ({
    page,
  }) => {
    await navigateTo(page, "/dashboard");
    await expect(page.getByText(/Submit Time/i)).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Quick Entry/i })
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Detailed Entry/i })
    ).toHaveCount(0);
  });
});
