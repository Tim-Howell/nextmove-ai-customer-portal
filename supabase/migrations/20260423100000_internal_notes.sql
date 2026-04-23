-- Create internal_notes table for multi-note system
CREATE TABLE internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('customer', 'priority', 'request')),
  entity_id UUID NOT NULL,
  note_text TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient lookups by entity
CREATE INDEX idx_internal_notes_entity ON internal_notes(entity_type, entity_id);

-- Enable RLS
ALTER TABLE internal_notes ENABLE ROW LEVEL SECURITY;

-- SELECT policy: admin and staff only
CREATE POLICY "Staff can read internal notes"
  ON internal_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- INSERT policy: admin and staff only
CREATE POLICY "Staff can create internal notes"
  ON internal_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- No UPDATE or DELETE policies - notes are append-only
