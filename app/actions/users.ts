"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";

export interface InternalUser {
  id: string;
  email: string;
  full_name: string | null;
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
    .select("id, email, full_name, role, is_active, created_at")
    .in("role", ["admin", "staff"])
    .order("full_name");

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

export async function inviteUser(email: string, role: "admin" | "staff") {
  const supabase = await createClient();

  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return { error: "User with this email already exists" };
  }

  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { role },
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
