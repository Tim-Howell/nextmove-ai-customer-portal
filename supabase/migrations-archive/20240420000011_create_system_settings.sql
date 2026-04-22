-- Create system_settings table
-- Key-value store for system-wide configuration

create table public.system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.system_settings enable row level security;

-- Insert default settings
insert into public.system_settings (key, value) values
  ('show_demo_data', 'false'::jsonb);

-- Add comments
comment on table public.system_settings is 'System-wide configuration settings';
comment on column public.system_settings.key is 'Setting identifier';
comment on column public.system_settings.value is 'Setting value as JSON';
