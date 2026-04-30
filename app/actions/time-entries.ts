"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  quickTimeEntrySchema,
  timeEntrySchema,
  type QuickTimeEntryFormData,
} from "@/lib/validations/time-entry";
import type { TimeEntryFormData } from "@/lib/validations/time-entry";
import {
  parseUserPreferences,
  type UserPreferences,
} from "@/lib/validations/user-preferences";
import type { TimeEntryWithRelations } from "@/types/database";
import { getShowDemoData } from "./settings";

export interface TimeEntriesFilter {
  customerId?: string;
  contractId?: string;
  staffId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export async function getTimeEntries(
  filter?: TimeEntriesFilter
): Promise<{ data: TimeEntryWithRelations[]; totalHours: number; error?: string }> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();

  let query = supabase
    .from("time_entries")
    .select(
      `
      *,
      customer:customers!inner(id, name, is_demo),
      contract:contracts(id, name),
      staff:profiles!time_entries_staff_id_fkey(id, full_name),
      entered_by_profile:profiles!time_entries_entered_by_fkey(id, full_name),
      category:reference_values!time_entries_category_id_fkey(id, type, value, label)
    `
    )
    .order("entry_date", { ascending: false });

  if (filter?.customerId) {
    query = query.eq("customer_id", filter.customerId);
  }
  if (filter?.contractId) {
    query = query.eq("contract_id", filter.contractId);
  }
  if (filter?.staffId) {
    query = query.eq("staff_id", filter.staffId);
  }
  if (filter?.categoryId) {
    query = query.eq("category_id", filter.categoryId);
  }
  if (filter?.startDate) {
    query = query.gte("entry_date", filter.startDate);
  }
  if (filter?.endDate) {
    query = query.lte("entry_date", filter.endDate);
  }
  
  // Filter out demo data if toggle is off
  if (!showDemoData) {
    query = query.eq("customer.is_demo", false);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching time entries:", error);
    return { data: [], totalHours: 0, error: "Failed to fetch time entries" };
  }

  const totalHours = (data || []).reduce(
    (sum, entry) => sum + Number(entry.hours),
    0
  );

  return { data: (data || []) as TimeEntryWithRelations[], totalHours };
}

export async function getTimeEntry(
  id: string
): Promise<{ data: TimeEntryWithRelations | null; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("time_entries")
    .select(
      `
      *,
      customer:customers(id, name),
      contract:contracts(id, name),
      staff:profiles!time_entries_staff_id_fkey(id, full_name),
      entered_by_profile:profiles!time_entries_entered_by_fkey(id, full_name),
      category:reference_values!time_entries_category_id_fkey(id, type, value, label)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching time entry:", error);
    return { data: null, error: "Failed to fetch time entry" };
  }

  return { data: data as TimeEntryWithRelations };
}

export async function createTimeEntry(data: TimeEntryFormData) {
  const supabase = await createClient();

  const validated = timeEntrySchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  // Check if contract is archived
  if (validated.data.contract_id) {
    const { data: contract } = await supabase
      .from("contracts")
      .select("archived_at")
      .eq("id", validated.data.contract_id)
      .single();

    if (contract?.archived_at) {
      return { error: "Cannot add time entries to an archived contract" };
    }
  }

  // Check if customer is archived
  const { data: customer } = await supabase
    .from("customers")
    .select("archived_at")
    .eq("id", validated.data.customer_id)
    .single();

  if (customer?.archived_at) {
    return { error: "Cannot add time entries for an archived customer" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("time_entries").insert({
    customer_id: validated.data.customer_id,
    contract_id: validated.data.contract_id,
    staff_id: validated.data.staff_id || user.id,
    entered_by: user.id,
    entry_date: validated.data.entry_date,
    hours: validated.data.hours,
    category_id: validated.data.category_id,
    description: validated.data.description || null,
    is_billable: validated.data.is_billable,
    internal_notes: validated.data.internal_notes || null,
  });

  if (error) {
    console.error("Error creating time entry:", error);
    return { error: "Failed to create time entry" };
  }

  revalidatePath("/time-logs");
  redirect("/time-logs");
}

export async function updateTimeEntry(id: string, data: TimeEntryFormData) {
  const supabase = await createClient();

  const validated = timeEntrySchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  const { error } = await supabase
    .from("time_entries")
    .update({
      customer_id: validated.data.customer_id,
      contract_id: validated.data.contract_id || null,
      entry_date: validated.data.entry_date,
      hours: validated.data.hours,
      category_id: validated.data.category_id,
      description: validated.data.description || null,
      is_billable: validated.data.is_billable,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating time entry:", error);
    return { error: "Failed to update time entry" };
  }

  revalidatePath("/time-logs");
  revalidatePath(`/time-logs/${id}`);
  redirect("/time-logs");
}

export async function deleteTimeEntry(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("time_entries").delete().eq("id", id);

  if (error) {
    console.error("Error deleting time entry:", error);
    return { error: "Failed to delete time entry" };
  }

  revalidatePath("/time-logs");
  return { success: true };
}

export async function getCustomerHoursThisMonth(
  customerId: string
): Promise<number> {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("time_entries")
    .select("hours")
    .eq("customer_id", customerId)
    .gte("entry_date", startOfMonth)
    .lte("entry_date", endOfMonth);

  if (error) {
    console.error("Error calculating hours this month:", error);
    return 0;
  }

  return (data || []).reduce((sum, entry) => sum + Number(entry.hours), 0);
}

export async function getRecentTimeEntries(
  customerId?: string,
  limit: number = 5
): Promise<TimeEntryWithRelations[]> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();

  let query = supabase
    .from("time_entries")
    .select(
      `
      *,
      customer:customers!inner(id, name, is_demo),
      contract:contracts(id, name),
      staff:profiles!time_entries_staff_id_fkey(id, full_name),
      category:reference_values!time_entries_category_id_fkey(id, type, value, label)
    `
    )
    .order("entry_date", { ascending: false })
    .limit(limit);

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }
  
  // Filter out demo data if toggle is off
  if (!showDemoData) {
    query = query.eq("customer.is_demo", false);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching recent time entries:", error);
    return [];
  }

  return (data || []) as TimeEntryWithRelations[];
}

export async function getStaffMembers(): Promise<
  { id: string; full_name: string | null }[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("role", ["admin", "staff"])
    .order("full_name");

  if (error) {
    console.error("Error fetching staff members:", error);
    return [];
  }

  return data || [];
}

export interface QuickEntryFormData {
  customers: { id: string; name: string }[];
  contracts: { id: string; name: string; customer_id: string; is_default: boolean }[];
  categories: { id: string; label: string; value: string }[];
  preferences: UserPreferences;
}

/**
 * Bundle the data the Quick Entry modal needs into a single round-trip.
 * Filters out archived customers/contracts so stale references aren't
 * pre-selected. Safe to call from the client; returns empty arrays for
 * unauthenticated users.
 */
export async function getQuickEntryFormData(): Promise<QuickEntryFormData> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { customers: [], contracts: [], categories: [], preferences: {} };
  }

  // Resolve archived contract status id once.
  const { data: archivedStatus } = await supabase
    .from("reference_values")
    .select("id")
    .eq("type", "contract_status")
    .eq("value", "archived")
    .maybeSingle();

  // Customers — non-archived, demo-aware.
  let customersQuery = supabase
    .from("customers")
    .select("id, name, is_demo")
    .neq("status", "archived")
    .is("archived_at", null)
    .order("name");
  if (!showDemoData) customersQuery = customersQuery.eq("is_demo", false);
  const { data: customers } = await customersQuery;

  // Contracts — non-archived.
  let contractsQuery = supabase
    .from("contracts")
    .select("id, name, customer_id, is_default")
    .is("archived_at", null)
    .order("name");
  if (archivedStatus) {
    contractsQuery = contractsQuery.neq("status_id", archivedStatus.id);
  }
  const { data: contracts } = await contractsQuery;

  // Time categories.
  const { data: categories } = await supabase
    .from("reference_values")
    .select("id, label, value")
    .eq("type", "time_category")
    .eq("is_active", true)
    .order("sort_order");

  // Preferences.
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  return {
    customers: (customers || []).map((c) => ({ id: c.id, name: c.name })),
    contracts: (contracts || []).map((c) => ({
      id: c.id,
      name: c.name,
      customer_id: c.customer_id,
      is_default: c.is_default ?? false,
    })),
    categories: (categories || []).map((c) => ({
      id: c.id,
      label: c.label,
      value: c.value,
    })),
    preferences: parseUserPreferences(profileRow?.preferences),
  };
}

/**
 * Read the current user's `profiles.preferences` jsonb, parsed tolerantly.
 * Returns `{}` for unauthenticated users or malformed payloads.
 */
export async function getUserPreferences(): Promise<UserPreferences> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data, error } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  if (error || !data) return {};
  return parseUserPreferences(data.preferences);
}

/**
 * Quick Time Entry creation path. Writes a `time_entries` row identical in
 * shape to one produced by `createTimeEntry`, with `internal_notes = null`
 * and `staff_id` forced to the current user. Persists last-used customer
 * and contract on the user's profile preferences for next-open defaults.
 *
 * Authorization: rejects `customer_user` role.
 */
export async function createQuickTimeEntry(
  data: QuickTimeEntryFormData
): Promise<{ error?: string; success?: true }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Role gate — customer_user must not be able to log time.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, preferences")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role === "customer_user") {
    return { error: "Not authorized to log time entries" };
  }

  const validated = quickTimeEntrySchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  // Defensive: same archive checks as the detailed createTimeEntry path.
  const { data: contract } = await supabase
    .from("contracts")
    .select("archived_at")
    .eq("id", validated.data.contract_id)
    .single();
  if (contract?.archived_at) {
    return { error: "Cannot add time entries to an archived contract" };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("archived_at")
    .eq("id", validated.data.customer_id)
    .single();
  if (customer?.archived_at) {
    return { error: "Cannot add time entries for an archived customer" };
  }

  const { error: insertError } = await supabase.from("time_entries").insert({
    customer_id: validated.data.customer_id,
    contract_id: validated.data.contract_id,
    staff_id: user.id,
    entered_by: user.id,
    entry_date: validated.data.entry_date,
    hours: validated.data.hours,
    category_id: validated.data.category_id,
    description: validated.data.description || null,
    is_billable: validated.data.is_billable,
    internal_notes: null,
  });

  if (insertError) {
    console.error("Error creating quick time entry:", insertError);
    return { error: "Failed to create time entry" };
  }

  // Persist last-used customer/contract on the user's preferences.
  const currentPrefs = parseUserPreferences(profile.preferences);
  const nextPrefs: UserPreferences = {
    ...currentPrefs,
    time_entry: {
      ...(currentPrefs.time_entry ?? {}),
      last_customer_id: validated.data.customer_id,
      last_contract_id: validated.data.contract_id,
    },
  };
  await supabase
    .from("profiles")
    .update({ preferences: nextPrefs })
    .eq("id", user.id);

  revalidatePath("/time-logs");
  revalidatePath("/dashboard");
  return { success: true };
}
