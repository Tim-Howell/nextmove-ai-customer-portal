-- Add is_demo column to customers
alter table public.customers
  add column is_demo boolean not null default false;

-- Add is_demo column to customer_contacts
alter table public.customer_contacts
  add column is_demo boolean not null default false;

-- Add is_active column to profiles for user deactivation
alter table public.profiles
  add column is_active boolean not null default true;

-- Create indexes for filtering
create index customers_is_demo_idx on public.customers(is_demo);
create index customer_contacts_is_demo_idx on public.customer_contacts(is_demo);
create index profiles_is_active_idx on public.profiles(is_active);

-- Add comments
comment on column public.customers.is_demo is 'Whether this is demo data';
comment on column public.customer_contacts.is_demo is 'Whether this is demo data';
comment on column public.profiles.is_active is 'Whether this user account is active';
