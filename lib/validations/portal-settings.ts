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
