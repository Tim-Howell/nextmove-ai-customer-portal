"use server";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import type {
  TimeEntry,
  ReferenceValue,
  RequestWithRelations,
  PriorityWithRelations,
  Customer,
} from "@/types/database";

export interface ReportFilters {
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  categoryIds?: string[];
  contractIds?: string[];
  billable?: "yes" | "no";
  staffIds?: string[];
}

export interface ReportSummary {
  totalHours: number;
  billableHours: number;
  entryCount: number;
}

export interface TimeEntryReportRow extends TimeEntry {
  customer?: { id: string; name: string };
  contract?: { id: string; name: string } | null;
  category?: ReferenceValue;
  staff?: { id: string; full_name: string } | null;
}

export async function getTimeEntriesReport(
  filters: ReportFilters = {}
): Promise<{ summary: ReportSummary; entries: TimeEntryReportRow[] }> {
  const supabase = await createClient();
  const profile = await getProfile();

  const isInternal = profile?.role === "admin" || profile?.role === "staff";

  let query = supabase
    .from("time_entries")
    .select(`
      id,
      customer_id,
      contract_id,
      staff_id,
      entry_date,
      hours,
      category_id,
      description,
      is_billable,
      created_at,
      updated_at,
      customer:customers(id, name),
      contract:contracts(id, name),
      category:reference_values!time_entries_category_id_fkey(id, value, label),
      staff:profiles!time_entries_staff_id_fkey(id, full_name)
    `)
    .order("entry_date", { ascending: false });

  // Apply customer filter
  if (!isInternal && profile?.customer_id) {
    query = query.eq("customer_id", profile.customer_id);
  } else if (filters.customerId) {
    query = query.eq("customer_id", filters.customerId);
  }

  // Apply date filters
  if (filters.dateFrom) {
    query = query.gte("entry_date", filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte("entry_date", filters.dateTo);
  }

  // Apply category filter (multi-select)
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    query = query.in("category_id", filters.categoryIds);
  }

  // Apply contract filter (multi-select)
  if (filters.contractIds && filters.contractIds.length > 0) {
    query = query.in("contract_id", filters.contractIds);
  }

  // Apply billable filter
  if (filters.billable === "yes") {
    query = query.eq("is_billable", true);
  } else if (filters.billable === "no") {
    query = query.eq("is_billable", false);
  }

  // Apply staff filter (multi-select)
  if (filters.staffIds && filters.staffIds.length > 0) {
    query = query.in("staff_id", filters.staffIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching time entries report:", error);
    return {
      summary: { totalHours: 0, billableHours: 0, entryCount: 0 },
      entries: [],
    };
  }

  const entries = (data || []) as unknown as TimeEntryReportRow[];

  // Calculate summary
  const summary: ReportSummary = {
    totalHours: entries.reduce((sum, e) => sum + Number(e.hours), 0),
    billableHours: entries
      .filter((e) => e.is_billable)
      .reduce((sum, e) => sum + Number(e.hours), 0),
    entryCount: entries.length,
  };

  return { summary, entries };
}

export async function getRecentRequests(
  customerId?: string,
  limit: number = 5
): Promise<RequestWithRelations[]> {
  const supabase = await createClient();
  const profile = await getProfile();

  const isInternal = profile?.role === "admin" || profile?.role === "staff";

  let query = supabase
    .from("requests")
    .select(`
      id,
      customer_id,
      submitted_by,
      title,
      description,
      status_id,
      internal_notes,
      created_at,
      updated_at,
      customer:customers(id, name),
      status:reference_values!requests_status_id_fkey(id, value, label),
      submitter:profiles!requests_submitted_by_fkey(id, full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  // Apply customer filter
  if (!isInternal && profile?.customer_id) {
    query = query.eq("customer_id", profile.customer_id);
  } else if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching recent requests:", error);
    return [];
  }

  // Sanitize internal_notes for non-internal users
  const sanitizedData = (data || []).map((request) => ({
    ...request,
    internal_notes: isInternal ? request.internal_notes : null,
  }));

  return sanitizedData as unknown as RequestWithRelations[];
}

export async function getRecentPriorities(
  customerId?: string,
  limit: number = 5
): Promise<PriorityWithRelations[]> {
  const supabase = await createClient();
  const profile = await getProfile();

  const isInternal = profile?.role === "admin" || profile?.role === "staff";

  // For customer users, use their customer_id from profile
  // For internal users, use the passed customerId or fetch all
  const effectiveCustomerId = isInternal ? customerId : profile?.customer_id;

  let query = supabase
    .from("priorities")
    .select(`
      id,
      customer_id,
      title,
      description,
      status_id,
      priority_level_id,
      target_date,
      created_by,
      updated_by,
      created_at,
      updated_at,
      customer:customers(id, name),
      status:reference_values!priorities_status_id_fkey(id, value, label),
      priority_level:reference_values!priorities_priority_level_id_fkey(id, value, label)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  // Apply customer filter if we have one
  if (effectiveCustomerId) {
    query = query.eq("customer_id", effectiveCustomerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching recent priorities:", error);
    return [];
  }

  return (data || []) as unknown as PriorityWithRelations[];
}

export async function getCustomersForReport(): Promise<Customer[]> {
  const supabase = await createClient();
  const profile = await getProfile();

  if (profile?.role !== "admin" && profile?.role !== "staff") {
    return [];
  }

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("status", "active")
    .order("name");

  if (error) {
    console.error("Error fetching customers for report:", error);
    return [];
  }

  return (data || []) as Customer[];
}

export async function getContractsForReport(customerId?: string): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  const profile = await getProfile();

  const isInternal = profile?.role === "admin" || profile?.role === "staff";

  let query = supabase
    .from("contracts")
    .select("id, name")
    .order("name");

  // For customers, filter to their contracts
  if (!isInternal && profile?.customer_id) {
    query = query.eq("customer_id", profile.customer_id);
  } else if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching contracts for report:", error);
    return [];
  }

  return (data || []) as { id: string; name: string }[];
}

export async function getStaffForReport(): Promise<{ id: string; full_name: string }[]> {
  const supabase = await createClient();
  const profile = await getProfile();

  if (profile?.role !== "admin" && profile?.role !== "staff") {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("role", ["admin", "staff"])
    .eq("is_active", true)
    .order("full_name");

  if (error) {
    console.error("Error fetching staff for report:", error);
    return [];
  }

  return (data || []) as { id: string; full_name: string }[];
}
