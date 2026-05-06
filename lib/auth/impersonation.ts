import { cookies } from "next/headers";

/**
 * Server-side helpers for the "View as Customer" admin impersonation feature.
 *
 * The impersonation state is stored entirely in a single HTTP-only cookie
 * (`view_as_customer_id`). The actual Supabase auth session is never touched
 * — the admin remains logged in as themselves; the app layer simply
 * synthesizes a customer_user profile when this cookie is present and the
 * real user is an admin. See `getProfile()` in `lib/supabase/profile.ts`.
 *
 * Important: this is a UI preview mechanism, not a security boundary. RLS
 * still grants the underlying admin session full access. To prevent
 * confusion / accidental writes from inside preview mode, mutating server
 * actions should call `assertNotImpersonating()` from
 * `lib/auth/impersonation-guard.ts`.
 */

export const VIEW_AS_COOKIE = "view_as_customer_id";

/** 8 hours — long enough for an admin's working session, short enough to auto-expire. */
const VIEW_AS_MAX_AGE_SECONDS = 60 * 60 * 8;

export async function getViewAsCustomerId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(VIEW_AS_COOKIE)?.value;
  return value && value.length > 0 ? value : null;
}

export async function setViewAsCustomerCookie(customerId: string): Promise<void> {
  const store = await cookies();
  store.set(VIEW_AS_COOKIE, customerId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: VIEW_AS_MAX_AGE_SECONDS,
  });
}

export async function clearViewAsCustomerCookie(): Promise<void> {
  const store = await cookies();
  store.delete(VIEW_AS_COOKIE);
}
