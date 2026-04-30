"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prioritySchema, type PriorityFormData, PRIORITY_STATUS_VALUES } from "@/lib/validations/priority";
import type { PriorityWithRelations } from "@/types/database";
import { getShowDemoData } from "./settings";

interface GetPrioritiesOptions {
  customerId?: string;
  statusId?: string;
  statusIds?: string[];
  priorityLevelId?: string;
}

export async function getPriorities(
  options: GetPrioritiesOptions = {}
): Promise<{ data: PriorityWithRelations[] }> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();
  const { customerId, statusId, statusIds, priorityLevelId } = options;

  let query = supabase
    .from("priorities")
    .select(`
      *,
      customer:customers!inner(id, name, is_demo),
      status:reference_values!priorities_status_id_fkey(id, value, label),
      priority_level:reference_values!priorities_priority_level_id_fkey(id, value, label),
      creator:profiles!priorities_created_by_fkey(id, full_name)
    `)
    .order("created_at", { ascending: false });

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }
  if (statusId) {
    query = query.eq("status_id", statusId);
  }
  if (statusIds && statusIds.length > 0) {
    query = query.in("status_id", statusIds);
  }
  if (priorityLevelId) {
    query = query.eq("priority_level_id", priorityLevelId);
  }
  
  // Filter out demo data if toggle is off
  if (!showDemoData) {
    query = query.eq("customer.is_demo", false);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching priorities:", error);
    return { data: [] };
  }

  return { data: (data || []) as PriorityWithRelations[] };
}

export async function getPriority(
  id: string
): Promise<{ data: PriorityWithRelations | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("priorities")
    .select(`
      *,
      customer:customers(id, name),
      status:reference_values!priorities_status_id_fkey(id, value, label),
      priority_level:reference_values!priorities_priority_level_id_fkey(id, value, label),
      creator:profiles!priorities_created_by_fkey(id, full_name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching priority:", error);
    return { data: null };
  }

  return { data: data as PriorityWithRelations };
}

export async function createPriority(
  formData: PriorityFormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const parsed = prioritySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Validation failed" };
  }

  // Check if customer is archived
  const { data: customer } = await supabase
    .from("customers")
    .select("archived_at")
    .eq("id", parsed.data.customer_id)
    .single();

  if (customer?.archived_at) {
    return { error: "Cannot create priorities for an archived customer" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Convert empty strings to null for optional fields
  const insertData = {
    ...parsed.data,
    due_date: parsed.data.due_date || null,
    image_url: parsed.data.image_url || null,
    description: parsed.data.description || null,
    created_by: user?.id,
    updated_by: user?.id,
  };

  const { error } = await supabase.from("priorities").insert(insertData);

  if (error) {
    console.error("Error creating priority:", error);
    return { error: "Failed to create priority" };
  }

  revalidatePath("/priorities");
  redirect("/priorities");
}

export async function updatePriority(
  id: string,
  formData: PriorityFormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  // Check if priority is read-only
  const { data: priority } = await supabase
    .from("priorities")
    .select("is_read_only")
    .eq("id", id)
    .single();

  if (priority?.is_read_only) {
    return { error: "This priority is read-only and cannot be edited" };
  }

  const parsed = prioritySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Validation failed" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("priorities")
    .update({
      ...parsed.data,
      updated_by: user?.id,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating priority:", error);
    return { error: "Failed to update priority" };
  }

  revalidatePath("/priorities");
  revalidatePath(`/priorities/${id}`);
  redirect(`/priorities/${id}`);
}

export async function deletePriority(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("priorities").delete().eq("id", id);

  if (error) {
    console.error("Error deleting priority:", error);
    return { error: "Failed to delete priority" };
  }

  revalidatePath("/priorities");
  redirect("/priorities");
}

export async function getOpenPrioritiesCount(
  customerId?: string
): Promise<number> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();

  // Get the "complete" status ID to exclude
  const { data: completeStatus } = await supabase
    .from("reference_values")
    .select("id")
    .eq("type", "priority_status")
    .eq("value", PRIORITY_STATUS_VALUES.COMPLETE)
    .single();

  let query = supabase
    .from("priorities")
    .select("id, customer:customers!inner(is_demo)", { count: "exact", head: true });

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  if (completeStatus) {
    query = query.neq("status_id", completeStatus.id);
  }
  
  // Filter out demo data if toggle is off
  if (!showDemoData) {
    query = query.eq("customer.is_demo", false);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting open priorities:", error);
    return 0;
  }

  return count || 0;
}
