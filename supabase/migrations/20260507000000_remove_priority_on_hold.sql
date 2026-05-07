-- Remove the `on_hold` priority status.
--
-- Any priorities currently using `on_hold` are migrated to `backlog` first so
-- there are no orphan rows when we delete the reference value. The reference
-- value itself is then deleted (not just deactivated) since the design treats
-- it as gone, not historical.
--
-- Order matters: update FKs first, delete the reference row last.

-- 1) Reassign any priorities with status = on_hold to backlog.
UPDATE public.priorities
SET status_id = (
  SELECT id FROM public.reference_values
  WHERE type = 'priority_status' AND value = 'backlog'
  LIMIT 1
)
WHERE status_id = (
  SELECT id FROM public.reference_values
  WHERE type = 'priority_status' AND value = 'on_hold'
  LIMIT 1
);

-- 2) Delete the on_hold reference value entirely.
DELETE FROM public.reference_values
WHERE type = 'priority_status' AND value = 'on_hold';
