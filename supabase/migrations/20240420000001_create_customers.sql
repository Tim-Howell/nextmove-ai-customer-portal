-- Create customers table
-- Core entity for managing customer accounts

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  primary_contact_id uuid references public.profiles(id) on delete set null,
  secondary_contact_id uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for status filtering
create index customers_status_idx on public.customers(status);

-- Create index for name search
create index customers_name_idx on public.customers(name);

-- Enable Row Level Security
alter table public.customers enable row level security;

-- Create trigger for updated_at
create trigger customers_updated_at
  before update on public.customers
  for each row execute function public.update_updated_at_column();

-- Add comments
comment on table public.customers is 'Customer accounts managed by NextMove AI';
comment on column public.customers.status is 'Customer status: active or inactive';
comment on column public.customers.primary_contact_id is 'Primary NextMove AI staff contact for this customer';
comment on column public.customers.secondary_contact_id is 'Secondary NextMove AI staff contact for this customer';
