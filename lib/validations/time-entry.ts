import { z } from "zod";

/**
 * Round a decimal-hours value UP to the next 15-minute increment.
 *
 * Billing policy: we always bill in 15-minute blocks and any partial
 * block rounds up. Examples: 0.10 -> 0.25, 0.60 -> 0.75, 1.00 -> 1.00.
 *
 * A tiny epsilon protects against float noise so an entry that is
 * already a clean quarter (e.g. 0.5000000001 from form coercion) does
 * not get bumped to the next block.
 */
function ceilToFifteenMinutes(hours: number): number {
  const epsilon = 1e-9;
  const blocks = Math.ceil(hours * 4 - epsilon);
  return blocks / 4;
}

export const timeEntrySchema = z.object({
  customer_id: z.string().uuid({ message: "Customer is required" }),
  contract_id: z.string().uuid({ message: "Contract is required" }),
  entry_date: z.string().min(1, { message: "Date is required" }),
  hours: z.coerce
    .number()
    .positive({ message: "Hours must be greater than 0" })
    .max(24, { message: "Hours cannot exceed 24" })
    .transform(ceilToFifteenMinutes),
  category_id: z.string().uuid({ message: "Category is required" }),
  description: z.string().nullable().optional(),
  internal_notes: z.string().nullable().optional(),
  is_billable: z.boolean(),
  staff_id: z.string().uuid().optional(),
});

export type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

/**
 * Quick Time Entry: reduced field set used by the sidebar Quick Entry modal.
 *
 * Differs from `timeEntrySchema` by:
 * - omitting `internal_notes` (always written as NULL)
 * - omitting `staff_id` (server always uses the current user)
 *
 * The remaining fields use the same constraints as the detailed form so the
 * resulting `time_entries` row is shape-identical regardless of entry path.
 */
export const quickTimeEntrySchema = z.object({
  customer_id: z.string().uuid({ message: "Customer is required" }),
  contract_id: z.string().uuid({ message: "Contract is required" }),
  entry_date: z.string().min(1, { message: "Date is required" }),
  hours: z.coerce
    .number()
    .positive({ message: "Hours must be greater than 0" })
    .max(24, { message: "Hours cannot exceed 24" })
    .transform(ceilToFifteenMinutes),
  category_id: z.string().uuid({ message: "Category is required" }),
  description: z.string().nullable().optional(),
  is_billable: z.boolean(),
});

export type QuickTimeEntryFormData = z.infer<typeof quickTimeEntrySchema>;

export const TIME_CATEGORY_VALUES = {
  ADMINISTRATIVE: "administrative",
  RESEARCH: "research",
  TECHNICAL: "technical",
  MEETINGS: "meetings",
} as const;
