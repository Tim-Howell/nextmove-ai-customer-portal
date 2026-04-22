"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { contractSchema } from "@/lib/validations/contract";
import type { ContractFormData } from "@/lib/validations/contract";
import type { ContractWithRelations, ContractDocument } from "@/types/database";
import { getShowDemoData } from "./settings";

export interface ContractsFilter {
  customerId?: string;
  statusId?: string;
  showArchived?: boolean;
}

export async function getContracts(
  filter?: ContractsFilter
): Promise<{ data: ContractWithRelations[]; error?: string }> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();

  let query = supabase
    .from("contracts")
    .select(
      `
      *,
      customer:customers!inner(id, name, is_demo),
      contract_type:contract_types(id, value, label, description, tracks_hours, has_hour_limit, is_recurring, supports_rollover),
      status:reference_values!contracts_status_id_fkey(id, type, value, label)
    `
    )
    .order("created_at", { ascending: false });

  if (filter?.customerId) {
    query = query.eq("customer_id", filter.customerId);
  }
  if (filter?.statusId) {
    query = query.eq("status_id", filter.statusId);
  } else if (!filter?.showArchived) {
    // If not filtering by status and not showing archived, exclude archived
    query = query.is("archived_at", null);
  }
  
  // Filter out demo data if toggle is off
  if (!showDemoData) {
    query = query.eq("customer.is_demo", false);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching contracts:", error);
    return { data: [], error: "Failed to fetch contracts" };
  }

  const contractsWithHours = await Promise.all(
    (data || []).map(async (contract) => {
      const hoursUsed = await getHoursUsed(contract.id);
      const hoursRemaining =
        contract.total_hours !== null ? contract.total_hours - hoursUsed : null;
      return {
        ...contract,
        hours_used: hoursUsed,
        hours_remaining: hoursRemaining,
      } as ContractWithRelations;
    })
  );

  return { data: contractsWithHours };
}

export async function getContract(
  id: string
): Promise<{ data: ContractWithRelations | null; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contracts")
    .select(
      `
      *,
      customer:customers(id, name),
      contract_type:contract_types(id, value, label, description, tracks_hours, has_hour_limit, is_recurring, supports_rollover),
      status:reference_values!contracts_status_id_fkey(id, type, value, label)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching contract:", error);
    return { data: null, error: "Failed to fetch contract" };
  }

  const hoursUsed = await getHoursUsed(id);
  const hoursRemaining =
    data.total_hours !== null ? data.total_hours - hoursUsed : null;

  return {
    data: {
      ...data,
      hours_used: hoursUsed,
      hours_remaining: hoursRemaining,
    } as ContractWithRelations,
  };
}

export async function createContract(data: ContractFormData) {
  const supabase = await createClient();

  const validated = contractSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("contracts").insert({
    customer_id: validated.data.customer_id,
    name: validated.data.name,
    contract_type_id: validated.data.contract_type_id,
    status_id: validated.data.status_id,
    start_date: validated.data.start_date || null,
    end_date: validated.data.end_date || null,
    total_hours: validated.data.total_hours || null,
    description: validated.data.description || null,
    created_by: user?.id || null,
    // Billing fields
    billing_day: validated.data.billing_day || null,
    hours_per_period: validated.data.hours_per_period || null,
    rollover_enabled: validated.data.rollover_enabled || false,
    rollover_expiration_days: validated.data.rollover_expiration_days || null,
    max_rollover_hours: validated.data.max_rollover_hours || null,
    fixed_cost: validated.data.fixed_cost || null,
  });

  if (error) {
    console.error("Error creating contract:", error);
    return { error: "Failed to create contract" };
  }

  revalidatePath("/contracts");
  redirect("/contracts");
}

export async function updateContract(id: string, data: ContractFormData) {
  const supabase = await createClient();

  const validated = contractSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  const { error } = await supabase
    .from("contracts")
    .update({
      customer_id: validated.data.customer_id,
      name: validated.data.name,
      contract_type_id: validated.data.contract_type_id,
      status_id: validated.data.status_id,
      start_date: validated.data.start_date || null,
      end_date: validated.data.end_date || null,
      total_hours: validated.data.total_hours || null,
      description: validated.data.description || null,
      // Billing fields
      billing_day: validated.data.billing_day || null,
      hours_per_period: validated.data.hours_per_period || null,
      rollover_enabled: validated.data.rollover_enabled || false,
      rollover_expiration_days: validated.data.rollover_expiration_days || null,
      max_rollover_hours: validated.data.max_rollover_hours || null,
      fixed_cost: validated.data.fixed_cost || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating contract:", error);
    return { error: "Failed to update contract" };
  }

  revalidatePath("/contracts");
  revalidatePath(`/contracts/${id}`);
  redirect(`/contracts/${id}`);
}

export async function deleteContract(id: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("time_entries")
    .select("*", { count: "exact", head: true })
    .eq("contract_id", id);

  if (count && count > 0) {
    return {
      error: `Cannot delete contract with ${count} time entries. Remove time entries first.`,
    };
  }

  const { error } = await supabase.from("contracts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting contract:", error);
    return { error: "Failed to delete contract" };
  }

  revalidatePath("/contracts");
  redirect("/contracts");
}

export async function getHoursUsed(contractId: string): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("time_entries")
    .select("hours")
    .eq("contract_id", contractId)
    .eq("is_billable", true);

  if (error) {
    console.error("Error calculating hours used:", error);
    return 0;
  }

  return (data || []).reduce((sum, entry) => sum + Number(entry.hours), 0);
}

export async function getContractDocuments(
  contractId: string
): Promise<{ data: ContractDocument[]; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contract_documents")
    .select("*")
    .eq("contract_id", contractId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching contract documents:", error);
    return { data: [], error: "Failed to fetch documents" };
  }

  return { data: data || [] };
}

export async function uploadContractDocument(
  contractId: string,
  formData: FormData
): Promise<{ data?: ContractDocument; error?: string }> {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const filePath = `contracts/${contractId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("portal-documents")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    return { error: "Failed to upload file" };
  }

  const { data, error: insertError } = await supabase
    .from("contract_documents")
    .insert({
      contract_id: contractId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      content_type: file.type,
      uploaded_by: user?.id || null,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error saving document metadata:", insertError);
    await supabase.storage.from("portal-documents").remove([filePath]);
    return { error: "Failed to save document" };
  }

  revalidatePath(`/contracts/${contractId}`);
  return { data };
}

export async function deleteContractDocument(
  contractId: string,
  documentId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: doc, error: fetchError } = await supabase
    .from("contract_documents")
    .select("file_path")
    .eq("id", documentId)
    .single();

  if (fetchError || !doc) {
    return { error: "Document not found" };
  }

  const { error: storageError } = await supabase.storage
    .from("portal-documents")
    .remove([doc.file_path]);

  if (storageError) {
    console.error("Error deleting file from storage:", storageError);
  }

  const { error: deleteError } = await supabase
    .from("contract_documents")
    .delete()
    .eq("id", documentId);

  if (deleteError) {
    console.error("Error deleting document record:", deleteError);
    return { error: "Failed to delete document" };
  }

  revalidatePath(`/contracts/${contractId}`);
  return {};
}

export async function getDocumentDownloadUrl(
  filePath: string
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("portal-documents")
    .createSignedUrl(filePath, 60);

  if (error) {
    console.error("Error creating signed URL:", error);
    return { error: "Failed to generate download link" };
  }

  return { url: data.signedUrl };
}

export async function archiveContract(id: string) {
  const supabase = await createClient();

  // Get the archived status ID
  const { data: archivedStatus } = await supabase
    .from("reference_values")
    .select("id")
    .eq("type", "contract_status")
    .eq("value", "archived")
    .single();

  if (!archivedStatus) {
    return { error: "Archived status not found. Please add 'archived' to contract_status reference values." };
  }

  const { error } = await supabase
    .from("contracts")
    .update({ 
      status_id: archivedStatus.id,
      archived_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error archiving contract:", error);
    return { error: "Failed to archive contract" };
  }

  revalidatePath("/contracts");
  return { success: true };
}

export async function unarchiveContract(id: string) {
  const supabase = await createClient();

  // Get the active status ID
  const { data: activeStatus } = await supabase
    .from("reference_values")
    .select("id")
    .eq("type", "contract_status")
    .eq("value", "active")
    .single();

  if (!activeStatus) {
    return { error: "Active status not found" };
  }

  const { error } = await supabase
    .from("contracts")
    .update({ 
      status_id: activeStatus.id,
      archived_at: null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error unarchiving contract:", error);
    return { error: "Failed to unarchive contract" };
  }

  revalidatePath("/contracts");
  return { success: true };
}

export async function getContractTypes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contract_types")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Error fetching contract types:", error);
    return [];
  }

  return data || [];
}
