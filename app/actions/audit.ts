"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuditLogWithUser, AuditAction } from "@/types/database";

export interface AuditLogFilter {
  tableName?: string;
  action?: AuditAction;
  userId?: string;
  recordId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditLogResult {
  data: AuditLogWithUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 25;

export async function getAuditLogs(
  filter: AuditLogFilter = {}
): Promise<{ data?: AuditLogResult; error?: string }> {
  const supabase = await createClient();

  const page = filter.page || 1;
  const pageSize = filter.pageSize || DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("audit_logs")
    .select(
      `
      *,
      user:profiles!audit_logs_user_id_fkey(id, full_name, email)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  // Apply filters
  if (filter.tableName) {
    query = query.eq("table_name", filter.tableName);
  }

  if (filter.action) {
    query = query.eq("action", filter.action);
  }

  if (filter.userId) {
    query = query.eq("user_id", filter.userId);
  }

  if (filter.recordId) {
    query = query.eq("record_id", filter.recordId);
  }

  if (filter.startDate) {
    query = query.gte("created_at", filter.startDate);
  }

  if (filter.endDate) {
    query = query.lte("created_at", filter.endDate);
  }

  // Apply pagination
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching audit logs:", error);
    return { error: "Failed to fetch audit logs" };
  }

  const total = count || 0;

  return {
    data: {
      data: (data || []) as AuditLogWithUser[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getAuditLogForRecord(
  tableName: string,
  recordId: string
): Promise<{ data?: AuditLogWithUser[]; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .select(
      `
      *,
      user:profiles!audit_logs_user_id_fkey(id, full_name, email)
    `
    )
    .eq("table_name", tableName)
    .eq("record_id", recordId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching audit log for record:", error);
    return { error: "Failed to fetch audit history" };
  }

  return { data: (data || []) as AuditLogWithUser[] };
}

export async function getAuditableTableNames(): Promise<string[]> {
  return [
    "customers",
    "customer_contacts",
    "contracts",
    "time_entries",
    "priorities",
    "requests",
    "profiles",
    "portal_settings",
    "reference_values",
    "contract_types",
  ];
}

export async function getAuditUsers(): Promise<
  { id: string; full_name: string | null; email: string }[]
> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("role", ["admin", "staff"])
    .order("full_name");

  return data || [];
}
