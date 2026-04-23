"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { getShowDemoData } from "./settings";

export interface InternalUser {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  role: "admin" | "staff";
  is_active: boolean;
  created_at: string;
}

export async function getInternalUsers(
  roleFilter?: "admin" | "staff"
): Promise<InternalUser[]> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id, email, full_name, first_name, last_name, title, role, is_active, created_at")
    .in("role", ["admin", "staff"])
    .order("first_name, last_name");

  if (roleFilter) {
    query = query.eq("role", roleFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data as InternalUser[];
}

export async function inviteUser(
  email: string, 
  role: "admin" | "staff",
  firstName?: string,
  lastName?: string,
  title?: string
) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return { error: "User with this email already exists" };
  }

  const fullName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : firstName || lastName || null;

  // Use admin client for inviting users (requires service role key)
  const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { 
      role,
      first_name: firstName || null,
      last_name: lastName || null,
      full_name: fullName,
      title: title || null,
    },
  });

  if (error) {
    console.error("Error inviting user:", error);
    return { error: "Failed to send invitation" };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

export async function updateUserRole(userId: string, newRole: "admin" | "staff") {
  const supabase = await createClient();
  const currentUser = await getProfile();

  if (currentUser?.id === userId) {
    return { error: "Cannot modify your own role" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Error updating role:", error);
    return { error: "Failed to update role" };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  const supabase = await createClient();
  const currentUser = await getProfile();

  if (currentUser?.id === userId) {
    return { error: "Cannot deactivate your own account" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId);

  if (error) {
    console.error("Error toggling user active:", error);
    return { error: "Failed to update user status" };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

export interface CustomerUser {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  customer_id: string;
  customer_name: string | null;
  is_active: boolean;
  portal_access_enabled: boolean;
  created_at: string;
}

export async function getCustomerUsers(): Promise<CustomerUser[]> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();

  // Query customer_contacts which are the actual customer portal users
  // Only show contacts with portal_access_enabled = true (actual portal users)
  let query = supabase
    .from("customer_contacts")
    .select(`
      id,
      email,
      full_name,
      first_name,
      last_name,
      title,
      customer_id,
      is_active,
      portal_access_enabled,
      created_at,
      customer:customers!customer_contacts_customer_id_fkey(name, is_demo)
    `)
    .eq("portal_access_enabled", true)
    .order("full_name");
  
  // Filter out demo data if toggle is off
  if (!showDemoData) {
    query = query.eq("customer.is_demo", false);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching customer users:", error);
    return [];
  }

  return (data || []).map((contact: any) => ({
    id: contact.id,
    email: contact.email,
    full_name: contact.full_name,
    first_name: contact.first_name,
    last_name: contact.last_name,
    title: contact.title,
    customer_id: contact.customer_id,
    customer_name: contact.customer?.name || null,
    is_active: contact.is_active,
    portal_access_enabled: contact.portal_access_enabled,
    created_at: contact.created_at,
  })) as CustomerUser[];
}

export async function getUserById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, first_name, last_name, title, role, customer_id, is_active, created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

export async function updateUser(id: string, data: {
  first_name?: string;
  last_name?: string;
  title?: string;
  role?: "admin" | "staff" | "customer_user";
  customer_id?: string | null;
  is_active?: boolean;
}) {
  const supabase = await createClient();
  const currentUser = await getProfile();

  // Don't allow deactivating own account
  if (data.is_active === false && currentUser?.id === id) {
    return { error: "Cannot deactivate your own account" };
  }

  // Update full_name if first/last name changed
  const updateData: any = { ...data };
  if (data.first_name !== undefined || data.last_name !== undefined) {
    const user = await getUserById(id);
    if (user) {
      const firstName = data.first_name ?? user.first_name;
      const lastName = data.last_name ?? user.last_name;
      updateData.full_name = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null;
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating user:", error);
    return { error: "Failed to update user" };
  }

  revalidatePath("/settings/users");
  return { success: true };
}
