-- Create customer_contacts table
-- Stores contact people for each customer

create table public.customer_contacts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  full_name text not null,
  title text,
  email text,
  phone text,
  is_active boolean not null default true,
  portal_access_enabled boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for customer_id lookups
create index customer_contacts_customer_id_idx on public.customer_contacts(customer_id);

-- Create index for active contacts
create index customer_contacts_is_active_idx on public.customer_contacts(is_active);

-- Enable Row Level Security
alter table public.customer_contacts enable row level security;

-- Create trigger for updated_at
create trigger customer_contacts_updated_at
  before update on public.customer_contacts
  for each row execute function public.update_updated_at_column();

-- Add comments
comment on table public.customer_contacts is 'Contact people associated with customer accounts';
comment on column public.customer_contacts.is_active is 'Whether this contact is currently active';
comment on column public.customer_contacts.portal_access_enabled is 'Whether this contact is eligible for portal access (invitation handled separately)';
