-- Drop internal_notes columns from customers, priorities, and requests tables
-- These are replaced by the new internal_notes table

ALTER TABLE customers DROP COLUMN IF EXISTS internal_notes;
ALTER TABLE priorities DROP COLUMN IF EXISTS internal_notes;
ALTER TABLE requests DROP COLUMN IF EXISTS internal_notes;
