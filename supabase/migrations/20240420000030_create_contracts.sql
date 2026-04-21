-- Create contracts table
create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null,
  contract_type_id uuid not null references public.reference_values(id),
  status_id uuid not null references public.reference_values(id),
  start_date date,
  end_date date,
  total_hours numeric(10,2),
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for performance
create index idx_contracts_customer_id on public.contracts(customer_id);
create index idx_contracts_status_id on public.contracts(status_id);
create index idx_contracts_contract_type_id on public.contracts(contract_type_id);

-- Add updated_at trigger
create trigger contracts_updated_at
  before update on public.contracts
  for each row
  execute function public.update_updated_at_column();

comment on table public.contracts is 'Customer contracts for tracking agreements and hours';
