-- Create priorities table
create table public.priorities (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  title text not null,
  description text,
  status_id uuid not null references public.reference_values(id),
  priority_level_id uuid not null references public.reference_values(id),
  due_date date,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create indexes
create index idx_priorities_customer_id on public.priorities(customer_id);
create index idx_priorities_status_id on public.priorities(status_id);
create index idx_priorities_priority_level_id on public.priorities(priority_level_id);
create index idx_priorities_created_by on public.priorities(created_by);

-- Create updated_at trigger
create trigger set_priorities_updated_at
  before update on public.priorities
  for each row
  execute function public.update_updated_at_column();
