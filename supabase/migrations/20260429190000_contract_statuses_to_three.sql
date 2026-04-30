-- Migration: Reduce contract_status reference values to three (Active, Expired, Archived)
--
-- Removes 'draft' and 'closed' contract statuses. Existing contracts using
-- those statuses are remapped:
--   draft  -> active
--   closed -> archived
--
-- The is_default flag is moved to 'active' before deleting 'draft'.

DO $$
DECLARE
  active_id   uuid;
  archived_id uuid;
  draft_id    uuid;
  closed_id   uuid;
BEGIN
  SELECT id INTO active_id   FROM public.reference_values WHERE type = 'contract_status' AND value = 'active';
  SELECT id INTO archived_id FROM public.reference_values WHERE type = 'contract_status' AND value = 'archived';
  SELECT id INTO draft_id    FROM public.reference_values WHERE type = 'contract_status' AND value = 'draft';
  SELECT id INTO closed_id   FROM public.reference_values WHERE type = 'contract_status' AND value = 'closed';

  -- Remap contracts off the doomed statuses (no-op when ids are null / no rows match)
  IF draft_id IS NOT NULL AND active_id IS NOT NULL THEN
    UPDATE public.contracts SET status_id = active_id WHERE status_id = draft_id;
  END IF;

  IF closed_id IS NOT NULL AND archived_id IS NOT NULL THEN
    UPDATE public.contracts SET status_id = archived_id WHERE status_id = closed_id;
  END IF;

  -- Promote 'active' to default within contract_status before deleting rows
  UPDATE public.reference_values
    SET is_default = (value = 'active')
    WHERE type = 'contract_status';

  -- Delete the removed reference values
  DELETE FROM public.reference_values
    WHERE type = 'contract_status'
      AND value IN ('draft', 'closed');
END $$;
