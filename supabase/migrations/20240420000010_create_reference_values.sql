-- Create reference_values table
-- Stores all dropdown/select values for the application

create table public.reference_values (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  value text not null,
  label text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  is_default boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(type, value)
);

-- Create indexes
create index reference_values_type_idx on public.reference_values(type);
create index reference_values_type_active_idx on public.reference_values(type, is_active);

-- Enable Row Level Security
alter table public.reference_values enable row level security;

-- Create trigger for updated_at
create trigger reference_values_updated_at
  before update on public.reference_values
  for each row execute function public.update_updated_at_column();

-- Add comments
comment on table public.reference_values is 'System reference values for dropdowns and selects';
comment on column public.reference_values.type is 'Category: contract_type, contract_status, time_category, priority_status, priority_level, request_status';
comment on column public.reference_values.value is 'Internal value used in code';
comment on column public.reference_values.label is 'Display label shown to users';
comment on column public.reference_values.sort_order is 'Order for display in dropdowns';
comment on column public.reference_values.is_default is 'Whether this is the default selection for new records';
comment on column public.reference_values.is_demo is 'Whether this is demo data';
