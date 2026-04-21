"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prioritySchema, type PriorityFormData, PRIORITY_STATUS_VALUES } from "@/lib/validations/priority";
import type { PriorityWithRelations } from "@/types/database";

interface GetPrioritiesOptions {
  customerId?: string;
  statusId?: string;
  priorityLevelId?: string;
}

export async function getPriorities(
  options: GetPrioritiesOptions = {}
): Promise<{ data: PriorityWithRelations[] }> {
  const supabase = await createClient();
  const { customerId, statusId, priorityLevelId } = options;

  let query = supabase
    .from("priorities")
    .select(`
      *,
      customer:customers(id, name),
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
  if (priorityLevelId) {
    query = query.eq("priority_level_id", priorityLevelId);
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
    return { error: parsed.error.errors[0].message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("priorities").insert({
    ...parsed.data,
    created_by: user?.id,
    updated_by: user?.id,
  });

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

  const parsed = prioritySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
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

  // Get the "complete" status ID to exclude
  const { data: completeStatus } = await supabase
    .from("reference_values")
    .select("id")
    .eq("type", "priority_status")
    .eq("value", PRIORITY_STATUS_VALUES.COMPLETE)
    .single();

  let query = supabase
    .from("priorities")
    .select("id", { count: "exact", head: true });

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  if (completeStatus) {
    query = query.neq("status_id", completeStatus.id);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting open priorities:", error);
    return 0;
  }

  return count || 0;
}
