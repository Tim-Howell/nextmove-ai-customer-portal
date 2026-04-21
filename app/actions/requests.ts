"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  requestSchema,
  customerRequestSchema,
  type RequestFormData,
  type CustomerRequestFormData,
  REQUEST_STATUS_VALUES,
} from "@/lib/validations/request";
import type { RequestWithRelations } from "@/types/database";

interface GetRequestsOptions {
  customerId?: string;
  statusId?: string;
}

async function getCurrentUserRole(): Promise<{
  role: string;
  customerId: string | null;
  userId: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { role: "customer_user", customerId: null, userId: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, customer_id")
    .eq("id", user.id)
    .single();

  return {
    role: profile?.role || "customer_user",
    customerId: profile?.customer_id || null,
    userId: user.id,
  };
}

export async function getRequests(
  options: GetRequestsOptions = {}
): Promise<{ data: RequestWithRelations[] }> {
  const supabase = await createClient();
  const { customerId, statusId } = options;
  const { role } = await getCurrentUserRole();
  const isInternal = role === "admin" || role === "staff";

  let query = supabase
    .from("requests")
    .select(`
      id,
      customer_id,
      submitted_by,
      title,
      description,
      status_id,
      ${isInternal ? "internal_notes," : ""}
      created_at,
      updated_at,
      customer:customers(id, name),
      status:reference_values!requests_status_id_fkey(id, value, label),
      submitter:profiles!requests_submitted_by_fkey(id, full_name)
    `)
    .order("created_at", { ascending: false });

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }
  if (statusId) {
    query = query.eq("status_id", statusId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching requests:", error);
    return { data: [] };
  }

  // Ensure internal_notes is null for non-internal users
  const sanitizedData = (data || []).map((request) => ({
    ...request,
    internal_notes: isInternal ? request.internal_notes : null,
  }));

  return { data: sanitizedData as RequestWithRelations[] };
}

export async function getRequest(
  id: string
): Promise<{ data: RequestWithRelations | null }> {
  const supabase = await createClient();
  const { role } = await getCurrentUserRole();
  const isInternal = role === "admin" || role === "staff";

  const { data, error } = await supabase
    .from("requests")
    .select(`
      id,
      customer_id,
      submitted_by,
      title,
      description,
      status_id,
      ${isInternal ? "internal_notes," : ""}
      created_at,
      updated_at,
      customer:customers(id, name),
      status:reference_values!requests_status_id_fkey(id, value, label),
      submitter:profiles!requests_submitted_by_fkey(id, full_name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching request:", error);
    return { data: null };
  }

  // Ensure internal_notes is null for non-internal users
  const sanitizedData = {
    ...data,
    internal_notes: isInternal ? data.internal_notes : null,
  };

  return { data: sanitizedData as RequestWithRelations };
}

export async function createRequest(
  formData: RequestFormData | CustomerRequestFormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { role, customerId, userId } = await getCurrentUserRole();
  const isInternal = role === "admin" || role === "staff";

  // Use different schema based on role
  const schema = isInternal ? requestSchema : customerRequestSchema;
  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  // Get the "new" status ID for default
  const { data: newStatus } = await supabase
    .from("reference_values")
    .select("id")
    .eq("type", "request_status")
    .eq("value", REQUEST_STATUS_VALUES.NEW)
    .single();

  const insertData: Record<string, unknown> = {
    ...parsed.data,
    submitted_by: userId,
    status_id: (formData as RequestFormData).status_id || newStatus?.id,
  };

  // For customer users, use their customer_id
  if (!isInternal) {
    if (!customerId) {
      return { error: "Customer not found" };
    }
    insertData.customer_id = customerId;
  }

  const { error } = await supabase.from("requests").insert(insertData);

  if (error) {
    console.error("Error creating request:", error);
    return { error: "Failed to create request" };
  }

  revalidatePath("/requests");
  redirect("/requests");
}

export async function updateRequest(
  id: string,
  formData: RequestFormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { role } = await getCurrentUserRole();

  // Only internal users can update requests
  if (role !== "admin" && role !== "staff") {
    return { error: "Not authorized" };
  }

  const parsed = requestSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { error } = await supabase
    .from("requests")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    console.error("Error updating request:", error);
    return { error: "Failed to update request" };
  }

  revalidatePath("/requests");
  revalidatePath(`/requests/${id}`);
  redirect(`/requests/${id}`);
}

export async function deleteRequest(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { role } = await getCurrentUserRole();

  // Only internal users can delete requests
  if (role !== "admin" && role !== "staff") {
    return { error: "Not authorized" };
  }

  const { error } = await supabase.from("requests").delete().eq("id", id);

  if (error) {
    console.error("Error deleting request:", error);
    return { error: "Failed to delete request" };
  }

  revalidatePath("/requests");
  redirect("/requests");
}

export async function getOpenRequestsCount(
  customerId?: string
): Promise<number> {
  const supabase = await createClient();

  // Get the "closed" status ID to exclude
  const { data: closedStatus } = await supabase
    .from("reference_values")
    .select("id")
    .eq("type", "request_status")
    .eq("value", REQUEST_STATUS_VALUES.CLOSED)
    .single();

  let query = supabase
    .from("requests")
    .select("id", { count: "exact", head: true });

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  if (closedStatus) {
    query = query.neq("status_id", closedStatus.id);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting open requests:", error);
    return 0;
  }

  return count || 0;
}
