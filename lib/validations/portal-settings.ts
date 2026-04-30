import { z } from "zod";

/** Accept either #RGB or #RRGGBB. Empty string is treated as "unset" and
 *  falls back to brand defaults at runtime. */
const hexColor = z
  .string()
  .regex(/^#(?:[0-9A-Fa-f]{3}){1,2}$/, "Invalid color format")
  .optional()
  .or(z.literal(""));

export const portalSettingsSchema = z.object({
  organization_name: z.string().min(1, "Organization name is required"),
  website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  logo_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  // Required core color (kept required to avoid breaking existing rows).
  primary_color: z
    .string()
    .regex(/^#(?:[0-9A-Fa-f]{3}){1,2}$/, "Invalid color format"),
  accent_color: hexColor,
  background_dark: hexColor,
  background_light: hexColor,
});

export type PortalSettingsFormData = z.infer<typeof portalSettingsSchema>;

export interface PortalSettings {
  id: string;
  organization_name: string;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  primary_color: string;
  accent_color: string | null;
  background_dark: string | null;
  background_light: string | null;
  created_at: string;
  updated_at: string;
}
