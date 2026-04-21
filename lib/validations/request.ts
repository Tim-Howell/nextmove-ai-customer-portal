import { z } from "zod";

export const requestSchema = z.object({
  customer_id: z.string().uuid("Invalid customer"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(5000, "Description too long").optional().nullable(),
  status_id: z.string().uuid("Invalid status").optional(),
  internal_notes: z.string().max(5000, "Notes too long").optional().nullable(),
});

export const customerRequestSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(5000, "Description too long").optional().nullable(),
});

export type RequestFormData = z.infer<typeof requestSchema>;
export type CustomerRequestFormData = z.infer<typeof customerRequestSchema>;

export const REQUEST_STATUS_VALUES = {
  NEW: "new",
  IN_REVIEW: "in_review",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
} as const;

export function isOpenRequestStatus(statusValue: string): boolean {
  return statusValue !== REQUEST_STATUS_VALUES.CLOSED;
}
