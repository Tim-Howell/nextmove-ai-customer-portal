-- Rename portal_settings brand-token columns for theme-agnostic naming.
--
-- The columns were originally named `background_dark` / `background_light`
-- for a dark-first design. Product direction has pivoted to an Apple-style
-- light theme, so we rename to `background_base` (page bg) and
-- `foreground_base` (page text) so the semantics survive future pivots.
--
-- Uses IF EXISTS so this migration is idempotent and can be safely applied
-- on databases that may or may not have the prior migration in place.

ALTER TABLE portal_settings
  RENAME COLUMN background_dark TO background_base;

ALTER TABLE portal_settings
  RENAME COLUMN background_light TO foreground_base;
