import { test as base, expect, Page } from "@playwright/test";

/**
 * Test accounts for E2E testing.
 * These should match accounts created by seed-demo-data.ts
 */
export const TEST_ACCOUNTS = {
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || "tim.r.howell@gmail.com",
    password: process.env.TEST_ADMIN_PASSWORD || "",
  },
  customer: {
    email: process.env.TEST_CUSTOMER_EMAIL || "demo-acme1@example.com",
    password: process.env.TEST_CUSTOMER_PASSWORD || "",
  },
};

/**
 * Login helper function
 */
export async function login(page: Page, email: string, useMagicLink = true) {
  await page.goto("/login");
  
  if (useMagicLink) {
    // Magic link flow - just verify the form works
    await page.fill('input[name="email"]', email);
    await page.click('button:has-text("Send Magic Link")');
    // Note: Can't complete magic link flow in tests without email access
    // For full E2E, use password login or mock the auth
  } else {
    // Password login flow
    await page.click('button:has-text("Sign in with password")');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', TEST_ACCOUNTS.admin.password);
    await page.click('button[type="submit"]:has-text("Sign In")');
  }
}

/**
 * Logout helper function
 */
export async function logout(page: Page) {
  // Click user menu and sign out
  await page.click('[data-testid="user-menu"]').catch(() => {
    // Fallback: look for user avatar or name
    page.click('button:has-text("Sign out")');
  });
  await page.click('button:has-text("Sign out")').catch(() => {});
  await expect(page).toHaveURL(/\/login/);
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.waitForURL(/\/dashboard/, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Extended test fixture with authentication helpers
 */
export const test = base.extend<{
  adminPage: Page;
  customerPage: Page;
}>({
  // Admin authenticated page
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Note: For real auth, you'd need to either:
    // 1. Use stored auth state from a setup script
    // 2. Use password login with test credentials
    // 3. Mock the auth at the API level
    
    await use(page);
    await context.close();
  },
  
  // Customer authenticated page
  customerPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await use(page);
    await context.close();
  },
});

export { expect };
