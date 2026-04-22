-- Create requests table
create table public.requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  submitted_by uuid references public.profiles(id),
  title text not null,
  description text,
  status_id uuid not null references public.reference_values(id),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create indexes
create index idx_requests_customer_id on public.requests(customer_id);
create index idx_requests_status_id on public.requests(status_id);
create index idx_requests_submitted_by on public.requests(submitted_by);

-- Create updated_at trigger
create trigger set_requests_updated_at
  before update on public.requests
  for each row
  execute function public.update_updated_at_column();
