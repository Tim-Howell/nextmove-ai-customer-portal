"use server";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/app/actions/users";
import { internalNoteSchema, type InternalNoteFormData } from "@/lib/validations/internal-note";
import type { InternalNoteEntityType, InternalNoteWithAuthor } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function getInternalNotes(
  entityType: InternalNoteEntityType,
  entityId: string
): Promise<InternalNoteWithAuthor[]> {
  const supabase = await createClient();
  const profile = await getProfile();

  // Only admin and staff can view internal notes
  if (!profile || !["admin", "staff"].includes(profile.role)) {
    return [];
  }

  const { data, error } = await supabase
    .from("internal_notes")
    .select(`
      id,
      entity_type,
      entity_id,
      note_text,
      created_by,
      created_at,
      author:profiles!internal_notes_created_by_fkey(id, full_name, email)
    `)
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching internal notes:", error);
    return [];
  }

  return (data || []).map((note: any) => ({
    id: note.id,
    entity_type: note.entity_type,
    entity_id: note.entity_id,
    note_text: note.note_text,
    created_by: note.created_by,
    created_at: note.created_at,
    author: note.author || { id: note.created_by, full_name: null, email: "Unknown" },
  }));
}

export async function createInternalNote(
  data: InternalNoteFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const profile = await getProfile();

  // Only admin and staff can create internal notes
  if (!profile || !["admin", "staff"].includes(profile.role)) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const validationResult = internalNoteSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: validationResult.error.errors[0].message };
  }

  const { error } = await supabase.from("internal_notes").insert({
    entity_type: data.entity_type,
    entity_id: data.entity_id,
    note_text: data.note_text,
    created_by: profile.id,
  });

  if (error) {
    console.error("Error creating internal note:", error);
    return { success: false, error: "Failed to create note" };
  }

  // Revalidate the entity page
  if (data.entity_type === "customer") {
    revalidatePath(`/customers/${data.entity_id}`);
  } else if (data.entity_type === "priority") {
    revalidatePath(`/priorities/${data.entity_id}`);
  } else if (data.entity_type === "request") {
    revalidatePath(`/requests/${data.entity_id}`);
  }

  return { success: true };
}
