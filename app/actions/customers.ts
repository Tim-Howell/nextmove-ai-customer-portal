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

export async function getCustomers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("id, name, status, logo_url, primary_contact_id, secondary_contact_id")
    .order("name");

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  return (data || []) as { id: string; name: string; status: string; logo_url: string | null; primary_contact_id: string | null; secondary_contact_id: string | null }[];
}
