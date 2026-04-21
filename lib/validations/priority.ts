import { z } from "zod";

export const prioritySchema = z.object({
  customer_id: z.string().uuid("Invalid customer"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").optional().nullable(),
  status_id: z.string().uuid("Invalid status"),
  priority_level_id: z.string().uuid("Invalid priority level"),
  due_date: z.string().optional().nullable(),
});

export type PriorityFormData = z.infer<typeof prioritySchema>;

export const PRIORITY_STATUS_VALUES = {
  BACKLOG: "backlog",
  NEXT_UP: "next_up",
  ACTIVE: "active",
  COMPLETE: "complete",
  ON_HOLD: "on_hold",
} as const;

export const PRIORITY_LEVEL_VALUES = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export function isOpenPriorityStatus(statusValue: string): boolean {
  return statusValue !== PRIORITY_STATUS_VALUES.COMPLETE;
}
