import { Page, expect } from "@playwright/test";

/**
 * Wait for page to be fully loaded (no network activity)
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState("networkidle");
}

/**
 * Wait for and verify a toast notification
 */
export async function expectToast(page: Page, message: string | RegExp) {
  const toast = page.locator('[data-sonner-toast]').filter({ hasText: message });
  await expect(toast).toBeVisible({ timeout: 10000 });
}

/**
 * Wait for toast to disappear
 */
export async function waitForToastDismiss(page: Page) {
  await page.locator('[data-sonner-toast]').waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
}

/**
 * Fill a form field by label
 */
export async function fillField(page: Page, label: string, value: string) {
  const field = page.getByLabel(label);
  await field.fill(value);
}

/**
 * Select an option from a select dropdown
 */
export async function selectOption(page: Page, label: string, value: string) {
  const trigger = page.getByLabel(label);
  await trigger.click();
  await page.getByRole("option", { name: value }).click();
}

/**
 * Click a button by text
 */
export async function clickButton(page: Page, text: string) {
  await page.getByRole("button", { name: text }).click();
}

/**
 * Navigate to a page and wait for load
 */
export async function navigateTo(page: Page, path: string) {
  await page.goto(path);
  await waitForPageLoad(page);
}

/**
 * Verify page title
 */
export async function expectPageTitle(page: Page, title: string | RegExp) {
  await expect(page.locator("h1, h2").first()).toContainText(title);
}

/**
 * Verify URL contains path
 */
export async function expectUrl(page: Page, path: string | RegExp) {
  if (typeof path === "string") {
    await expect(page).toHaveURL(new RegExp(path));
  } else {
    await expect(page).toHaveURL(path);
  }
}

/**
 * Check if element exists
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  const count = await page.locator(selector).count();
  return count > 0;
}

/**
 * Get table row count
 */
export async function getTableRowCount(page: Page): Promise<number> {
  return await page.locator("tbody tr").count();
}

/**
 * Click on a table row by text content
 */
export async function clickTableRow(page: Page, text: string) {
  await page.locator("tbody tr").filter({ hasText: text }).click();
}

/**
 * Verify empty state is shown
 */
export async function expectEmptyState(page: Page, message?: string) {
  const emptyState = page.locator('[data-testid="empty-state"]').or(
    page.locator("text=No .* found")
  );
  await expect(emptyState).toBeVisible();
  if (message) {
    await expect(emptyState).toContainText(message);
  }
}

/**
 * Verify loading state is shown
 */
export async function expectLoading(page: Page) {
  const loading = page.locator('[data-testid="loading"]').or(
    page.locator(".animate-pulse")
  );
  await expect(loading).toBeVisible();
}

/**
 * Wait for loading to complete
 */
export async function waitForLoadingComplete(page: Page) {
  await page.locator(".animate-pulse").waitFor({ state: "hidden", timeout: 30000 }).catch(() => {});
}

/**
 * Generate a unique test identifier
 */
export function generateTestId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Screenshot helper for debugging
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}
