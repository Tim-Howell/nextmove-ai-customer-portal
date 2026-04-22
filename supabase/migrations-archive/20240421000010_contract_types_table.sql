-- Create contract_types table to replace reference_values for contract types
-- This table defines both display labels AND behavior configuration

create table public.contract_types (
  id uuid primary key default gen_random_uuid(),
  
  -- Display
  value text unique not null,
  label text not null,
  description text,
  sort_order integer default 0,
  is_active boolean default true,
  
  -- Behavior flags
  tracks_hours boolean default true,           -- Whether hours are tracked
  has_hour_limit boolean default false,        -- Whether there's a limit on hours
  is_recurring boolean default false,          -- Whether hours refresh periodically
  supports_rollover boolean default false,     -- Whether unused hours can roll over
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add updated_at trigger
create trigger contract_types_updated_at
  before update on public.contract_types
  for each row
  execute function public.update_updated_at_column();

-- Seed the contract types with behavior configuration
insert into public.contract_types (value, label, description, sort_order, tracks_hours, has_hour_limit, is_recurring, supports_rollover) values
  ('hours_bucket', 'Hours Bucket', 'Fixed pool of hours to be used within a timeframe', 1, true, true, false, false),
  ('hours_subscription', 'Hours Subscription', 'Recurring hours that refresh monthly', 2, true, true, true, true),
  ('fixed_cost', 'Fixed Cost', 'Fixed price contract with hours tracked for visibility', 3, true, false, false, false),
  ('service_subscription', 'Service Subscription', 'Ongoing service at fixed cost with hours tracked', 4, true, false, true, false),
  ('on_demand', 'On-Demand / Ad-Hoc', 'Billed as used with no set parameters', 5, true, false, false, false);

-- Add RLS policies
alter table public.contract_types enable row level security;

-- Everyone can read contract types
create policy "Contract types are viewable by authenticated users"
  on public.contract_types for select
  to authenticated
  using (true);

-- Only admins can modify (but we don't expose this in UI)
create policy "Contract types are modifiable by admins"
  on public.contract_types for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Add comment
comment on table public.contract_types is 'Contract type definitions with behavior configuration';
