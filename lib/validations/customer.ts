import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, { message: "Customer name is required" }),
  status: z.enum(["active", "inactive"]),
  primary_contact_id: z.string().uuid().nullable().optional(),
  secondary_contact_id: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
  logo_url: z.string().url("Invalid URL").nullable().optional(),
  website: z.string().url("Invalid URL").nullable().optional().or(z.literal("")),
  billing_contact_primary_id: z.string().uuid().nullable().optional(),
  billing_contact_secondary_id: z.string().uuid().nullable().optional(),
  poc_primary_id: z.string().uuid().nullable().optional(),
  poc_secondary_id: z.string().uuid().nullable().optional(),
  is_demo: z.boolean().optional(),
});

export const customerContactSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }),
  title: z.string().nullable().optional(),
  email: z.string().email({ message: "Invalid email address" }).or(z.literal("")).nullable().optional(),
  phone: z.string().nullable().optional(),
  is_active: z.boolean(),
  portal_access_enabled: z.boolean(),
  notes: z.string().nullable().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
export type CustomerContactFormData = z.infer<typeof customerContactSchema>;
