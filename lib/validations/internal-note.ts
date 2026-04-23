import { z } from "zod";

export const internalNoteSchema = z.object({
  entity_type: z.enum(["customer", "priority", "request"]),
  entity_id: z.string().uuid(),
  note_text: z.string().min(1, "Note text is required").max(10000, "Note text is too long"),
});

export type InternalNoteFormData = z.infer<typeof internalNoteSchema>;
