"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { portalSettingsSchema } from "@/lib/validations/portal-settings";
import type { PortalSettings, PortalSettingsFormData } from "@/lib/validations/portal-settings";

export async function getPortalSettings(): Promise<PortalSettings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portal_settings")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching portal settings:", error);
    return null;
  }

  return data;
}

export async function updatePortalSettings(data: PortalSettingsFormData) {
  const supabase = await createClient();

  const validated = portalSettingsSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed" };
  }

  // Get the existing settings row (there should only be one)
  const { data: existing } = await supabase
    .from("portal_settings")
    .select("id")
    .limit(1)
    .single();

  if (!existing) {
    // Create if doesn't exist
    const { error: insertError } = await supabase
      .from("portal_settings")
      .insert({
        organization_name: validated.data.organization_name,
        website_url: validated.data.website_url || null,
        logo_url: validated.data.logo_url || null,
        description: validated.data.description || null,
        primary_color: validated.data.primary_color,
        secondary_color: validated.data.secondary_color,
      });

    if (insertError) {
      console.error("Error creating portal settings:", insertError);
      return { error: "Failed to create portal settings" };
    }
  } else {
    // Update existing row
    const { error } = await supabase
      .from("portal_settings")
      .update({
        organization_name: validated.data.organization_name,
        website_url: validated.data.website_url || null,
        logo_url: validated.data.logo_url || null,
        description: validated.data.description || null,
        primary_color: validated.data.primary_color,
        secondary_color: validated.data.secondary_color,
      })
      .eq("id", existing.id);

    if (error) {
      console.error("Error updating portal settings:", error);
      return { error: "Failed to update portal settings" };
    }
  }

  revalidatePath("/settings/portal-branding");
  return { success: true };
}

export async function uploadLogo(file: File): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" };
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: "File size must be less than 2MB" };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("portal-assets")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error("Error uploading logo:", error);
    return { error: "Failed to upload logo" };
  }

  const { data: { publicUrl } } = supabase.storage
    .from("portal-assets")
    .getPublicUrl(fileName);

  return { url: publicUrl };
}
