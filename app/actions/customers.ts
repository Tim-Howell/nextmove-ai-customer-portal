"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { customerSchema, customerContactSchema } from "@/lib/validations/customer";
import type { CustomerFormData, CustomerContactFormData } from "@/lib/validations/customer";
import { ERROR_CODES, logError } from "@/lib/errors";

export async function createCustomer(data: CustomerFormData) {
  const supabase = await createClient();

  const validated = customerSchema.safeParse(data);
  if (!validated.success) {
    return { 
      error: validated.error.errors[0]?.message || "Validation failed",
      code: ERROR_CODES.CUS_CRE_002,
    };
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
      logo_url: validated.data.logo_url || null,
      website: validated.data.website?.toLowerCase() || null,
      is_demo: validated.data.is_demo || false,
    })
    .select("id")
    .single();

  if (error || !newCustomer) {
    logError(error, "createCustomer");
    return { error: "Failed to create customer", code: ERROR_CODES.CUS_CRE_002 };
  }

  // Auto-create base contract for ad-hoc/on-demand hours
  const [{ data: activeStatus, error: statusError }, { data: onDemandType, error: typeError }] = await Promise.all([
    supabase
      .from("reference_values")
      .select("id")
      .eq("type", "contract_status")
      .eq("value", "active")
      .single(),
    supabase
      .from("contract_types")
      .select("id")
      .eq("value", "on_demand")
      .single(),
  ]);

  if (statusError) {
    console.error("Failed to fetch active status:", statusError);
  }
  if (typeError) {
    console.error("Failed to fetch on_demand type:", typeError);
  }

  if (activeStatus && onDemandType) {
    const { error: contractError } = await supabase.from("contracts").insert({
      customer_id: newCustomer.id,
      name: "On-Demand Services - No Contract",
      contract_type_id: onDemandType.id,
      status_id: activeStatus.id,
      is_default: true,
    });

    if (contractError) {
      // Rollback: delete the customer if base contract creation fails
      await supabase.from("customers").delete().eq("id", newCustomer.id);
      logError(contractError, "createCustomer - base contract");
      return { error: "Failed to create base contract", code: ERROR_CODES.CUS_CRE_002 };
    }
  } else {
    console.warn("Skipping base contract creation - missing activeStatus or onDemandType");
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
      logo_url: validated.data.logo_url || null,
      website: validated.data.website?.toLowerCase() || null,
      billing_contact_primary_id: validated.data.billing_contact_primary_id || null,
      billing_contact_secondary_id: validated.data.billing_contact_secondary_id || null,
      poc_primary_id: validated.data.poc_primary_id || null,
      poc_secondary_id: validated.data.poc_secondary_id || null,
      is_demo: validated.data.is_demo || false,
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

function formatPhoneDigitsOnly(phone: string | null | undefined): string | null {
  if (!phone) return null;
  return phone.replace(/\D/g, "") || null;
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

  const email = validated.data.email?.toLowerCase() || null;
  const phone = formatPhoneDigitsOnly(validated.data.phone);

  // If portal access is enabled and email exists, create auth user first
  let userId: string | null = null;
  if (validated.data.portal_access_enabled && email) {
    const adminClient = createAdminClient();
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: validated.data.full_name,
        role: "customer_user",
        customer_id: customerId,
      },
    });

    if (authError) {
      // User might already exist - try to find them
      if (authError.message?.includes("already been registered")) {
        const { data: existingUsers } = await adminClient.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === email);
        if (existingUser) {
          userId = existingUser.id;
        }
      } else {
        console.error("Error creating auth user:", authError);
        return { error: "Failed to create portal account" };
      }
    } else if (authUser?.user) {
      userId = authUser.user.id;
    }
  }

  const { data: newContact, error } = await supabase.from("customer_contacts").insert({
    customer_id: customerId,
    full_name: validated.data.full_name,
    title: validated.data.title || null,
    email,
    phone,
    is_active: validated.data.is_active,
    portal_access_enabled: validated.data.portal_access_enabled,
    user_id: userId,
    notes: validated.data.notes || null,
  }).select("id").single();

  if (error || !newContact) {
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

  const email = validated.data.email?.toLowerCase() || null;
  const phone = formatPhoneDigitsOnly(validated.data.phone);

  // Get current contact to check if portal access is being enabled
  const { data: currentContact } = await supabase
    .from("customer_contacts")
    .select("user_id, portal_access_enabled")
    .eq("id", contactId)
    .single();

  // If enabling portal access and no user_id exists, create auth user
  let userId = currentContact?.user_id || null;
  if (validated.data.portal_access_enabled && !userId && email) {
    const adminClient = createAdminClient();
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: validated.data.full_name,
        role: "customer_user",
        customer_id: customerId,
      },
    });

    if (authError) {
      // User might already exist - try to find them
      if (authError.message?.includes("already been registered")) {
        const { data: existingUsers } = await adminClient.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === email);
        if (existingUser) {
          userId = existingUser.id;
        }
      } else {
        console.error("Error creating auth user:", authError);
        return { error: "Failed to create portal account" };
      }
    } else if (authUser?.user) {
      userId = authUser.user.id;
    }
  }

  const { error } = await supabase
    .from("customer_contacts")
    .update({
      full_name: validated.data.full_name,
      title: validated.data.title || null,
      email,
      phone,
      is_active: validated.data.is_active,
      portal_access_enabled: validated.data.portal_access_enabled,
      user_id: userId,
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
    logError(customerError, "archiveCustomer");
    return { error: "Failed to archive customer", code: ERROR_CODES.CUS_ARC_002 };
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
