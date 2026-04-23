"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createInternalNote } from "@/app/actions/internal-notes";
import type { InternalNoteEntityType } from "@/types/database";
import { Loader2 } from "lucide-react";

interface AddNoteFormProps {
  entityType: InternalNoteEntityType;
  entityId: string;
  onNoteAdded?: () => void;
}

export function AddNoteForm({ entityType, entityId, onNoteAdded }: AddNoteFormProps) {
  const [noteText, setNoteText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await createInternalNote({
      entity_type: entityType,
      entity_id: entityId,
      note_text: noteText.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      setNoteText("");
      onNoteAdded?.();
    } else {
      setError(result.error || "Failed to add note");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Add an internal note..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        rows={3}
        disabled={isSubmitting}
        className="w-full"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting || !noteText.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Add Note"
          )}
        </Button>
      </div>
    </form>
  );
}
