-- Add a configurable support email to portal settings.
-- Surfaced in Admin Settings -> Portal Branding and used anywhere the UI
-- tells users to "contact support". Defaults to the NextMove AI inbox so
-- existing rows pick up a sensible value immediately.

ALTER TABLE public.portal_settings
  ADD COLUMN IF NOT EXISTS support_email text;

UPDATE public.portal_settings
  SET support_email = 'info@nextmoveaiservices.com'
  WHERE support_email IS NULL;

COMMENT ON COLUMN public.portal_settings.support_email IS
  'Support contact email shown to portal users (configurable in admin settings).';
