"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import type { CustomerInvitation, InvitationStatus } from "@/types/database";

export async function getInvitationStatus(
  contactId: string,
  userId: string | null
): Promise<{ status: InvitationStatus; invitation: CustomerInvitation | null }> {
  if (userId) {
    return { status: "active", invitation: null };
  }

  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("customer_invitations")
    .select("*")
    .eq("contact_id", contactId)
    .is("accepted_at", null)
    .order("invited_at", { ascending: false })
    .limit(1)
    .single();

  if (!invitation) {
    return { status: "not_invited", invitation: null };
  }

  const now = new Date();
  const expiresAt = new Date(invitation.expires_at);

  if (expiresAt < now) {
    return { status: "expired", invitation: invitation as CustomerInvitation };
  }

  return { status: "pending", invitation: invitation as CustomerInvitation };
}

export async function sendCustomerInvitation(contactId: string) {
  const supabase = await createClient();
  const profile = await getProfile();

  if (!profile || !["admin", "staff"].includes(profile.role)) {
    return { error: "Unauthorized" };
  }

  const { data: contact, error: contactError } = await supabase
    .from("customer_contacts")
    .select("id, email, portal_access_enabled, user_id, customer_id")
    .eq("id", contactId)
    .single();

  if (contactError || !contact) {
    return { error: "Contact not found" };
  }

  if (!contact.email) {
    return { error: "Contact must have an email address" };
  }

  if (!contact.portal_access_enabled) {
    return { error: "Portal access must be enabled for this contact" };
  }

  if (contact.user_id) {
    return { error: "Contact already has portal access" };
  }

  const { error: authError } = await supabase.auth.signInWithOtp({
    email: contact.email,
    options: {
      data: {
        contact_id: contactId,
        customer_id: contact.customer_id,
        role: "customer_user",
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (authError) {
    console.error("Error sending invitation email:", authError);
    if (authError.message?.includes("rate") || authError.status === 429) {
      return { error: "Please wait a minute before sending another invitation" };
    }
    return { error: authError.message || "Failed to send invitation email" };
  }

  const { error: inviteError } = await supabase.from("customer_invitations").insert({
    contact_id: contactId,
    email: contact.email,
    invited_by: profile.id,
  });

  if (inviteError) {
    console.error("Error creating invitation record:", inviteError);
  }

  revalidatePath(`/customers/${contact.customer_id}`);
  return { success: true };
}

export async function resendCustomerInvitation(contactId: string) {
  const supabase = await createClient();
  const profile = await getProfile();

  if (!profile || !["admin", "staff"].includes(profile.role)) {
    return { error: "Unauthorized" };
  }

  const { data: contact, error: contactError } = await supabase
    .from("customer_contacts")
    .select("id, email, portal_access_enabled, user_id, customer_id")
    .eq("id", contactId)
    .single();

  if (contactError || !contact) {
    return { error: "Contact not found" };
  }

  if (!contact.email) {
    return { error: "Contact must have an email address" };
  }

  if (contact.user_id) {
    return { error: "Contact already has portal access" };
  }

  const { error: authError } = await supabase.auth.signInWithOtp({
    email: contact.email,
    options: {
      data: {
        contact_id: contactId,
        customer_id: contact.customer_id,
        role: "customer_user",
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (authError) {
    console.error("Error sending invitation email:", authError);
    if (authError.message?.includes("rate") || authError.status === 429) {
      return { error: "Please wait a minute before sending another invitation" };
    }
    return { error: authError.message || "Failed to send invitation email" };
  }

  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);

  const { error: inviteError } = await supabase.from("customer_invitations").insert({
    contact_id: contactId,
    email: contact.email,
    invited_by: profile.id,
    expires_at: newExpiresAt.toISOString(),
  });

  if (inviteError) {
    console.error("Error creating invitation record:", inviteError);
  }

  revalidatePath(`/customers/${contact.customer_id}`);
  return { success: true };
}

export async function acceptCustomerInvitation(
  userId: string,
  contactId: string,
  customerId: string
) {
  const supabase = await createClient();

  const { error: contactError } = await supabase
    .from("customer_contacts")
    .update({ user_id: userId })
    .eq("id", contactId);

  if (contactError) {
    console.error("Error linking contact to user:", contactError);
    return { error: "Failed to link contact" };
  }

  const { error: invitationError } = await supabase
    .from("customer_invitations")
    .update({ accepted_at: new Date().toISOString() })
    .eq("contact_id", contactId)
    .is("accepted_at", null);

  if (invitationError) {
    console.error("Error updating invitation:", invitationError);
  }

  return { success: true };
}
