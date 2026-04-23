"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InternalNoteCard } from "./internal-note-card";
import { AddNoteForm } from "./add-note-form";
import { getInternalNotes } from "@/app/actions/internal-notes";
import type { InternalNoteEntityType, InternalNoteWithAuthor } from "@/types/database";
import { StickyNote } from "lucide-react";

interface InternalNotesSectionProps {
  entityType: InternalNoteEntityType;
  entityId: string;
}

export function InternalNotesSection({ entityType, entityId }: InternalNotesSectionProps) {
  const [notes, setNotes] = useState<InternalNoteWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    const data = await getInternalNotes(entityType, entityId);
    setNotes(data);
    setIsLoading(false);
  }, [entityType, entityId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StickyNote className="h-5 w-5" />
          Internal Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AddNoteForm
          entityType={entityType}
          entityId={entityId}
          onNoteAdded={fetchNotes}
        />
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No internal notes yet.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.map((note) => (
              <InternalNoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
