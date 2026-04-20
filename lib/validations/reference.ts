import { z } from "zod";

export const referenceValueTypes = [
  "contract_type",
  "contract_status",
  "time_category",
  "priority_status",
  "priority_level",
  "request_status",
] as const;

export const referenceValueSchema = z.object({
  type: z.enum(referenceValueTypes),
  value: z.string().min(1, { message: "Value is required" }),
  label: z.string().min(1, { message: "Label is required" }),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
  is_default: z.boolean(),
  is_demo: z.boolean(),
});

export type ReferenceValueFormData = z.infer<typeof referenceValueSchema>;

export const referenceTypeLabels: Record<typeof referenceValueTypes[number], string> = {
  contract_type: "Contract Types",
  contract_status: "Contract Statuses",
  time_category: "Time Categories",
  priority_status: "Priority Statuses",
  priority_level: "Priority Levels",
  request_status: "Request Statuses",
};
