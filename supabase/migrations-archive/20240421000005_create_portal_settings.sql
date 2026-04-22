-- Create portal_settings table
create table if not exists public.portal_settings (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null default 'NextMove AI',
  website_url text,
  logo_url text,
  description text,
  primary_color text default '#3b82f6',
  secondary_color text default '#64748b',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add comments
comment on table public.portal_settings is 'Portal branding and customization settings';
comment on column public.portal_settings.organization_name is 'Organization name displayed in the portal';
comment on column public.portal_settings.website_url is 'Organization website URL';
comment on column public.portal_settings.logo_url is 'URL to organization logo in storage';
comment on column public.portal_settings.description is 'Organization description';
comment on column public.portal_settings.primary_color is 'Primary brand color';
comment on column public.portal_settings.secondary_color is 'Secondary brand color';

-- Insert default settings (only if table is empty)
insert into public.portal_settings (organization_name, website_url, description)
select 
  'NextMove AI',
  'https://nextmove-ai.com',
  'AI-powered customer portal for streamlined service management'
where not exists (select 1 from public.portal_settings);

-- Create function to update updated_at timestamp
create or replace function public.update_portal_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to auto-update updated_at
create trigger portal_settings_updated_at
  before update on public.portal_settings
  for each row
  execute function public.update_portal_settings_updated_at();
