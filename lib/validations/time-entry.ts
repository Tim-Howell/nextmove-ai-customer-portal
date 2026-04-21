import { z } from "zod";

export const timeEntrySchema = z.object({
  customer_id: z.string().uuid({ message: "Customer is required" }),
  contract_id: z.string().uuid({ message: "Contract is required" }),
  entry_date: z.string().min(1, { message: "Date is required" }),
  hours: z.coerce
    .number()
    .positive({ message: "Hours must be greater than 0" })
    .max(24, { message: "Hours cannot exceed 24" }),
  category_id: z.string().uuid({ message: "Category is required" }),
  description: z.string().nullable().optional(),
  is_billable: z.boolean(),
  staff_id: z.string().uuid().optional(),
});

export type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

export const TIME_CATEGORY_VALUES = {
  ADMINISTRATIVE: "administrative",
  RESEARCH: "research",
  TECHNICAL: "technical",
  MEETINGS: "meetings",
} as const;
