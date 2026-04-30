-- Migration: Brand-token columns on portal_settings.
--
-- Renames `secondary_color` -> `accent_color` (semantically that is what the
-- existing field has been driving — a contrast/CTA accent, not a "secondary"
-- surface) and adds two background tokens for the dark-first Soft Modernist
-- theme. Both new columns are nullable; the application code resolves NULLs
-- to brand defaults at runtime.

DO $$
BEGIN
  -- Rename secondary_color -> accent_color, idempotent.
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'portal_settings'
      AND column_name = 'secondary_color'
  ) THEN
    ALTER TABLE public.portal_settings
      RENAME COLUMN secondary_color TO accent_color;
  END IF;
END $$;

ALTER TABLE public.portal_settings
  ADD COLUMN IF NOT EXISTS background_dark text,
  ADD COLUMN IF NOT EXISTS background_light text;
