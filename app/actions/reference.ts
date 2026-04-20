"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { referenceValueSchema } from "@/lib/validations/reference";
import type { ReferenceValueFormData } from "@/lib/validations/reference";
import type { ReferenceValue, ReferenceValueType } from "@/types/database";

export async function getReferenceValues(
  type?: ReferenceValueType
): Promise<ReferenceValue[]> {
  const supabase = await createClient();

  let query = supabase
    .from("reference_values")
    .select("*")
    .order("type")
    .order("sort_order");

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching reference values:", error);
    return [];
  }

  return data as ReferenceValue[];
}

export async function getReferenceValuesByType(
  type: ReferenceValueType,
  activeOnly: boolean = true
): Promise<ReferenceValue[]> {
  const supabase = await createClient();

  let query = supabase
    .from("reference_values")
    .select("*")
    .eq("type", type)
    .order("sort_order");

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching reference values:", error);
    return [];
  }

  return data as ReferenceValue[];
}

export async function createReferenceValue(data: ReferenceValueFormData) {
  const supabase = await createClient();

  const validated = referenceValueSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  const { error } = await supabase.from("reference_values").insert({
    type: validated.data.type,
    value: validated.data.value,
    label: validated.data.label,
    sort_order: validated.data.sort_order,
    is_active: validated.data.is_active,
    is_default: validated.data.is_default,
    is_demo: validated.data.is_demo,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Value already exists for this type" };
    }
    console.error("Error creating reference value:", error);
    return { error: "Failed to create reference value" };
  }

  revalidatePath("/settings/reference-data");
  return { success: true };
}

export async function updateReferenceValue(
  id: string,
  data: Partial<ReferenceValueFormData>
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reference_values")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating reference value:", error);
    return { error: "Failed to update reference value" };
  }

  revalidatePath("/settings/reference-data");
  return { success: true };
}

export async function deleteReferenceValue(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reference_values")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting reference value:", error);
    return { error: "Failed to delete reference value" };
  }

  revalidatePath("/settings/reference-data");
  return { success: true };
}
