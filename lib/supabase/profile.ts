import { createClient } from "./server";
import { getViewAsCustomerId } from "@/lib/auth/impersonation";

export type UserRole = "admin" | "staff" | "customer_user";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  role: UserRole;
  customer_id: string | null;
  avatar_url: string | null;
  is_active: boolean;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  /**
   * Set to true on the synthesized profile returned from `getProfile()`
   * when the real user is an admin viewing the portal as a customer.
   * Never set on rows fetched directly from the database.
   */
  _impersonating?: boolean;
  /** Real (admin) profile id when `_impersonating` is true. */
  _realProfileId?: string;
}

/**
 * Returns the database `profiles` row for the currently authenticated user.
 * Never applies impersonation logic — use this when you need to know who
 * the *real* logged-in user is (audit logging, mutation guards, the
 * impersonation banner, the View-as / Exit actions themselves).
 */
export async function getRealProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile as Profile | null;
}

/**
 * Returns the *effective* profile for rendering and authorization decisions.
 * If the real user is an admin AND the `view_as_customer_id` cookie is set
 * to a valid customer, returns a synthesized profile with `role` flipped
 * to `customer_user` and `customer_id` set to the impersonated customer.
 * In every other case, returns the real profile unchanged.
 */
export async function getProfile(): Promise<Profile | null> {
  const real = await getRealProfile();
  if (!real || real.role !== "admin") {
    return real;
  }

  const viewAsId = await getViewAsCustomerId();
  if (!viewAsId) {
    return real;
  }

  // Verify the cookie value points at a real customer; if it's stale
  // (customer deleted, archived, etc.) we silently fall back to the
  // real admin profile rather than render a broken state.
  const supabase = await createClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("id", viewAsId)
    .maybeSingle();

  if (!customer) {
    return real;
  }

  return {
    ...real,
    role: "customer_user",
    customer_id: viewAsId,
    _impersonating: true,
    _realProfileId: real.id,
  };
}

export interface ImpersonationContext {
  realProfile: Profile;
  customer: { id: string; name: string };
}

/**
 * Returns information about the active impersonation session, or `null`
 * when the current user is not impersonating. Used by the persistent
 * `<ImpersonationBanner />` and by the exit-impersonation flow.
 */
export async function getImpersonationContext(): Promise<ImpersonationContext | null> {
  const real = await getRealProfile();
  if (!real || real.role !== "admin") {
    return null;
  }

  const viewAsId = await getViewAsCustomerId();
  if (!viewAsId) {
    return null;
  }

  const supabase = await createClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("id, name")
    .eq("id", viewAsId)
    .maybeSingle();

  if (!customer) {
    return null;
  }

  return {
    realProfile: real,
    customer: { id: customer.id, name: customer.name },
  };
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export function isInternalUser(role: UserRole): boolean {
  return role === "admin" || role === "staff";
}

export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}
