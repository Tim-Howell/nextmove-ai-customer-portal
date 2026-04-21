"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export const portalSettingsSchema = z.object({
  organization_name: z.string().min(1, "Organization name is required"),
  website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  logo_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
});

export type PortalSettingsFormData = z.infer<typeof portalSettingsSchema>;

export interface PortalSettings {
  id: string;
  organization_name: string;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
}

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
    .eq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    console.error("Error updating portal settings:", error);
    return { error: "Failed to update portal settings" };
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
