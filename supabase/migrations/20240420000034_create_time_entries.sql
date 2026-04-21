-- Create time_entries table
create table public.time_entries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  contract_id uuid references public.contracts(id) on delete set null,
  staff_id uuid not null references public.profiles(id),
  entry_date date not null,
  hours numeric(5,2) not null check (hours > 0 and hours <= 24),
  category_id uuid not null references public.reference_values(id),
  description text,
  is_billable boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for performance
create index idx_time_entries_customer_id on public.time_entries(customer_id);
create index idx_time_entries_contract_id on public.time_entries(contract_id);
create index idx_time_entries_staff_id on public.time_entries(staff_id);
create index idx_time_entries_entry_date on public.time_entries(entry_date);
create index idx_time_entries_category_id on public.time_entries(category_id);

-- Add updated_at trigger
create trigger time_entries_updated_at
  before update on public.time_entries
  for each row
  execute function public.update_updated_at_column();

comment on table public.time_entries is 'Time logged against customers and contracts';
