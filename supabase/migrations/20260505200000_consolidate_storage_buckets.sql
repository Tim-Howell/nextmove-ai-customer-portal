-- ============================================================================
-- Storage bucket consolidation
-- ============================================================================
--
-- Background: the consolidated schema migration created a `contract-documents`
-- bucket plus three RLS policies, but no application code ever used it. The
-- app uploads contract documents to `portal-documents` (private) and logos to
-- `portal-assets` (public). This migration drops the orphan bucket and its
-- policies so the canonical surface is exactly two buckets:
--
--   portal-assets    — public  — org logo, customer logos, future public images
--   portal-documents — private — contract files, future private attachments
--
-- The migration is idempotent and safe to re-run. Supabase's
-- storage.protect_delete() trigger blocks SQL-level DELETE on storage
-- tables, so this migration cannot remove the orphan `contract-documents`
-- bucket itself — it only drops the bucket's policies (rendering it inert)
-- and emits a NOTICE telling the operator to finish the cleanup manually
-- via the dashboard: Storage → contract-documents → Delete bucket.
-- ============================================================================

-- Drop the three policies created for the orphan bucket. DROP POLICY IF EXISTS
-- is idempotent and a no-op when the policy doesn't exist (e.g. environments
-- where the consolidated schema hasn't run yet).
DROP POLICY IF EXISTS "Authenticated users can upload contract documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view contract documents"   ON storage.objects;
DROP POLICY IF EXISTS "Internal users can delete contract documents"      ON storage.objects;

-- Note: Supabase blocks `DELETE FROM storage.objects` and
-- `DELETE FROM storage.buckets` via the storage.protect_delete() trigger,
-- so the orphan `contract-documents` bucket cannot be removed from a SQL
-- migration. After this migration runs, delete the bucket manually:
--
--   Supabase dashboard → Storage → contract-documents → ⋯ → Delete bucket
--
-- The block below emits a NOTICE if the orphan bucket still exists so the
-- migration log makes the manual step obvious.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'contract-documents') THEN
    RAISE NOTICE 'Orphan bucket "contract-documents" still exists. Delete it via the Supabase dashboard (Storage → contract-documents → Delete bucket). Its policies have been dropped above so it is now inert.';
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- Ensure the two canonical buckets exist with the correct public flag.
-- ON CONFLICT (id) DO UPDATE makes this idempotent and self-healing: if the
-- bucket already exists with the wrong `public` value (e.g. someone toggled
-- it in the dashboard) it gets corrected on the next migration run.
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('portal-assets',    'portal-assets',    true),
  ('portal-documents', 'portal-documents', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- ----------------------------------------------------------------------------
-- portal-assets policies (public read, authenticated write).
-- Drop-then-create pattern keeps re-runs safe.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "portal-assets: public read"             ON storage.objects;
DROP POLICY IF EXISTS "portal-assets: authenticated upload"    ON storage.objects;
DROP POLICY IF EXISTS "portal-assets: authenticated update"    ON storage.objects;
DROP POLICY IF EXISTS "portal-assets: authenticated delete"    ON storage.objects;

CREATE POLICY "portal-assets: public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portal-assets');

CREATE POLICY "portal-assets: authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portal-assets');

CREATE POLICY "portal-assets: authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portal-assets')
WITH CHECK (bucket_id = 'portal-assets');

CREATE POLICY "portal-assets: authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portal-assets');

-- ----------------------------------------------------------------------------
-- portal-documents policies (private — authenticated read/write, internal
-- users only for delete). These were missing entirely on environments where
-- the consolidated schema's typo'd bucket name was never corrected, which is
-- why the bucket showed 0 policies in the dashboard.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "portal-documents: authenticated read"   ON storage.objects;
DROP POLICY IF EXISTS "portal-documents: authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "portal-documents: authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "portal-documents: internal delete"      ON storage.objects;

CREATE POLICY "portal-documents: authenticated read"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'portal-documents');

CREATE POLICY "portal-documents: authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portal-documents');

CREATE POLICY "portal-documents: authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portal-documents')
WITH CHECK (bucket_id = 'portal-documents');

-- Delete is restricted to internal staff/admin — customer_users can read
-- the contract files attached to their contracts but cannot remove them.
CREATE POLICY "portal-documents: internal delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portal-documents'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
  )
);
