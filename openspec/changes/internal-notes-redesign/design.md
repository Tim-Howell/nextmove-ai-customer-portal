## Context

Currently, internal notes are stored as a single `internal_notes` TEXT column on the `customers`, `priorities`, and `requests` tables. This approach has limitations:
- Only one note per record with no history
- No attribution (who wrote it)
- No timestamps (when was it written)
- Overwriting previous content loses information

Staff need to track multiple interactions, decisions, and updates over time. The new design introduces a separate `internal_notes` table that supports multiple notes per entity with full audit trail.

## Goals / Non-Goals

**Goals:**
- Support multiple internal notes per customer, priority, or request
- Track author and timestamp for each note
- Display notes in reverse chronological order (newest first)
- Simple "Add Note" interface on detail pages
- Migrate existing notes to preserve historical data
- Staff-only visibility (not visible to customer_user role)

**Non-Goals:**
- Editing or deleting notes (notes are append-only for audit purposes)
- Rich text formatting (plain text only)
- File attachments on notes
- Note categories or tags
- Notifications when notes are added

## Decisions

### 1. Polymorphic Table Design

**Decision**: Use a single `internal_notes` table with `entity_type` and `entity_id` columns.

**Alternatives Considered**:
- Separate tables per entity (`customer_notes`, `priority_notes`, `request_notes`) - More tables to maintain, duplicate schema
- JSON array on parent record - No relational integrity, harder to query

**Rationale**: Polymorphic design is simpler, allows shared components, and is a common pattern. The `entity_type` enum ensures type safety.

### 2. Table Schema

```sql
CREATE TABLE internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('customer', 'priority', 'request')),
  entity_id UUID NOT NULL,
  note_text TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_internal_notes_entity ON internal_notes(entity_type, entity_id);
```

### 3. RLS Policies

**Decision**: Only admin and staff can read/write internal notes. Customer users cannot see them.

```sql
-- Read policy: admin and staff only
CREATE POLICY "Staff can read internal notes"
  ON internal_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Insert policy: admin and staff only
CREATE POLICY "Staff can create internal notes"
  ON internal_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );
```

### 4. No Edit/Delete

**Decision**: Notes are append-only. No update or delete operations.

**Rationale**: Maintains audit integrity. If a correction is needed, add a new note referencing the previous one.

### 5. UI Component Design

**Decision**: Create a reusable `InternalNotesSection` component that takes `entityType` and `entityId` props.

- Displays existing notes in a scrollable list (newest first)
- "Add Note" button opens inline form
- Form has single textarea + submit button
- Author name and timestamp displayed on each note

### 6. Migration Strategy

**Decision**: Create migration script to copy existing `internal_notes` content to new table.

- For each record with non-null `internal_notes`, create a note entry
- Set `created_by` to the record's `created_by` or a system user
- Set `created_at` to the record's `updated_at` or `created_at`
- Keep old columns temporarily, remove in future migration after verification

## Risks / Trade-offs

**[Data Migration]** → Existing notes may not have clear authorship
- Mitigation: Use record's `created_by` field or a designated "System Migration" user

**[Performance]** → Many notes per entity could slow page load
- Mitigation: Paginate notes (show last 10, "Load more" button) - can add later if needed

**[No Edit/Delete]** → Users may want to correct typos
- Mitigation: Add new note with correction; document this as expected behavior

**[Polymorphic FK]** → No database-level referential integrity to parent tables
- Mitigation: Application-level validation; orphaned notes are harmless (just won't display)
