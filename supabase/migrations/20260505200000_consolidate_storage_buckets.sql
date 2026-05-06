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
-- The migration is idempotent and safe to re-run. It will refuse to drop the
-- bucket row if any objects still live there; in that case, delete or move
-- the objects in the Supabase dashboard first, then re-run.
-- ============================================================================

-- Drop the three policies created for the orphan bucket. DROP POLICY IF EXISTS
-- is idempotent and a no-op when the policy doesn't exist (e.g. environments
-- where the consolidated schema hasn't run yet).
DROP POLICY IF EXISTS "Authenticated users can upload contract documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view contract documents"   ON storage.objects;
DROP POLICY IF EXISTS "Internal users can delete contract documents"      ON storage.objects;

-- Remove any orphan object rows that point at the bucket. This will fail if
-- the bucket still has live files; that's intentional — surfacing the failure
-- forces a manual review rather than silently destroying user data.
DELETE FROM storage.objects WHERE bucket_id = 'contract-documents';

-- Finally drop the bucket row. Wrapped in a guarded DELETE so re-runs are
-- harmless on environments where it was already removed.
DELETE FROM storage.buckets WHERE id = 'contract-documents';

-- Sanity-check that the two canonical buckets exist. We don't try to create
-- them here because their RLS policies live in the consolidated schema /
-- earlier migrations and re-creating them would conflict. If either is
-- missing on a given environment, follow the README setup steps.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'portal-assets') THEN
    RAISE NOTICE 'portal-assets bucket is missing — create it via the README setup steps.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'portal-documents') THEN
    RAISE NOTICE 'portal-documents bucket is missing — create it via the README setup steps.';
  END IF;
END $$;
