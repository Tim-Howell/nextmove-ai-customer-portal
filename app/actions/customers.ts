"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { customerSchema, customerContactSchema } from "@/lib/validations/customer";
import type { CustomerFormData, CustomerContactFormData } from "@/lib/validations/customer";

export async function createCustomer(data: CustomerFormData) {
  const supabase = await createClient();

  const validated = customerSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  // Create the customer
  const { data: newCustomer, error } = await supabase
    .from("customers")
    .insert({
      name: validated.data.name,
      status: validated.data.status,
      primary_contact_id: validated.data.primary_contact_id || null,
      secondary_contact_id: validated.data.secondary_contact_id || null,
      notes: validated.data.notes || null,
      internal_notes: validated.data.internal_notes || null,
      logo_url: validated.data.logo_url || null,
    })
    .select("id")
    .single();

  if (error || !newCustomer) {
    console.error("Error creating customer:", error);
    return { error: "Failed to create customer" };
  }

  // Auto-create default "On-Demand / Off Contract" contract
  const { data: refValues } = await supabase
    .from("reference_values")
    .select("id, type, value")
    .in("type", ["contract_status", "contract_type"])
    .in("value", ["active", "hours_subscription"]);

  const activeStatusId = refValues?.find(r => r.type === "contract_status" && r.value === "active")?.id;
  const contractTypeId = refValues?.find(r => r.type === "contract_type" && r.value === "hours_subscription")?.id;

  if (activeStatusId && contractTypeId) {
    await supabase.from("contracts").insert({
      customer_id: newCustomer.id,
      name: "On-Demand / Off Contract",
      contract_type_id: contractTypeId,
      status_id: activeStatusId,
      is_default: true,
      start_date: new Date().toISOString().split("T")[0],
    });
  }

  revalidatePath("/customers");
  redirect("/customers");
}

export async function updateCustomer(id: string, data: CustomerFormData) {
  const supabase = await createClient();

  const validated = customerSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  const { error } = await supabase
    .from("customers")
    .update({
      name: validated.data.name,
      status: validated.data.status,
      primary_contact_id: validated.data.primary_contact_id || null,
      secondary_contact_id: validated.data.secondary_contact_id || null,
      notes: validated.data.notes || null,
      internal_notes: validated.data.internal_notes || null,
      logo_url: validated.data.logo_url || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating customer:", error);
    return { error: "Failed to update customer" };
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect(`/customers/${id}`);
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("customers").delete().eq("id", id);

  if (error) {
    console.error("Error deleting customer:", error);
    return { error: "Failed to delete customer" };
  }

  revalidatePath("/customers");
  redirect("/customers");
}

export async function createCustomerContact(
  customerId: string,
  data: CustomerContactFormData
) {
  const supabase = await createClient();

  const validated = customerContactSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  const { error } = await supabase.from("customer_contacts").insert({
    customer_id: customerId,
    full_name: validated.data.full_name,
    title: validated.data.title || null,
    email: validated.data.email || null,
    phone: validated.data.phone || null,
    is_active: validated.data.is_active,
    portal_access_enabled: validated.data.portal_access_enabled,
    notes: validated.data.notes || null,
  });

  if (error) {
    console.error("Error creating contact:", error);
    return { error: "Failed to create contact" };
  }

  revalidatePath(`/customers/${customerId}`);
  redirect(`/customers/${customerId}`);
}

export async function updateCustomerContact(
  customerId: string,
  contactId: string,
  data: CustomerContactFormData
) {
  const supabase = await createClient();

  const validated = customerContactSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  const { error } = await supabase
    .from("customer_contacts")
    .update({
      full_name: validated.data.full_name,
      title: validated.data.title || null,
      email: validated.data.email || null,
      phone: validated.data.phone || null,
      is_active: validated.data.is_active,
      portal_access_enabled: validated.data.portal_access_enabled,
      notes: validated.data.notes || null,
    })
    .eq("id", contactId);

  if (error) {
    console.error("Error updating contact:", error);
    return { error: "Failed to update contact" };
  }

  revalidatePath(`/customers/${customerId}`);
  redirect(`/customers/${customerId}`);
}

export async function deleteCustomerContact(customerId: string, contactId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("customer_contacts")
    .delete()
    .eq("id", contactId);

  if (error) {
    console.error("Error deleting contact:", error);
    return { error: "Failed to delete contact" };
  }

  revalidatePath(`/customers/${customerId}`);
  return { success: true };
}

export async function getCustomers(includeArchived = true) {
  const supabase = await createClient();

  let query = supabase
    .from("customers")
    .select("id, name, status, logo_url, primary_contact_id, secondary_contact_id")
    .order("name");

  if (!includeArchived) {
    query = query.neq("status", "archived");
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  return (data || []) as { id: string; name: string; status: string; logo_url: string | null; primary_contact_id: string | null; secondary_contact_id: string | null }[];
}

export async function archiveCustomer(id: string) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // 1. Archive the customer
  const { error: customerError } = await supabase
    .from("customers")
    .update({ 
      status: "archived",
      archived_at: now,
    })
    .eq("id", id);

  if (customerError) {
    console.error("Error archiving customer:", customerError);
    return { error: "Failed to archive customer" };
  }

  // 2. Cascade: Archive all customer contracts
  const { error: contractsError } = await supabase
    .from("contracts")
    .update({ archived_at: now })
    .eq("customer_id", id)
    .is("archived_at", null);

  if (contractsError) {
    console.error("Error archiving customer contracts:", contractsError);
  }

  // 3. Cascade: Disable portal access for all customer contacts
  const { error: contactsError } = await supabase
    .from("customer_contacts")
    .update({ 
      portal_access_enabled: false,
      is_archived: true,
      archived_at: now,
    })
    .eq("customer_id", id);

  if (contactsError) {
    console.error("Error archiving customer contacts:", contactsError);
  }

  // 4. Cascade: Mark all open priorities as read-only
  const { error: prioritiesError } = await supabase
    .from("priorities")
    .update({ is_read_only: true })
    .eq("customer_id", id)
    .eq("is_read_only", false);

  if (prioritiesError) {
    console.error("Error marking priorities as read-only:", prioritiesError);
  }

  // 5. Cascade: Mark all open requests as read-only
  const { error: requestsError } = await supabase
    .from("requests")
    .update({ is_read_only: true })
    .eq("customer_id", id)
    .eq("is_read_only", false);

  if (requestsError) {
    console.error("Error marking requests as read-only:", requestsError);
  }

  revalidatePath("/customers");
  revalidatePath("/contracts");
  revalidatePath("/priorities");
  revalidatePath("/requests");
  return { success: true };
}

export async function unarchiveCustomer(id: string) {
  const supabase = await createClient();

  // Only restore the customer - do NOT cascade restore contracts/contacts
  // User must manually restore those if needed
  const { error } = await supabase
    .from("customers")
    .update({ 
      status: "active",
      archived_at: null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error unarchiving customer:", error);
    return { error: "Failed to unarchive customer" };
  }

  revalidatePath("/customers");
  return { success: true };
}
