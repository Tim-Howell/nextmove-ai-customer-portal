"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { InternalNoteWithAuthor } from "@/types/database";
import { formatDistanceToNow } from "date-fns";

interface InternalNoteCardProps {
  note: InternalNoteWithAuthor;
}

export function InternalNoteCard({ note }: InternalNoteCardProps) {
  const authorName = note.author?.full_name || note.author?.email || "Unknown";
  const relativeTime = formatDistanceToNow(new Date(note.created_at), { addSuffix: true });

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className="font-medium">{authorName}</span>
          <span>{relativeTime}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{note.note_text}</p>
      </CardContent>
    </Card>
  );
}
