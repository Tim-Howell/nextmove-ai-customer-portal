-- Enable RLS on priorities
alter table public.priorities enable row level security;

-- Internal users (admin, staff) can do everything
create policy "Internal users have full access to priorities"
  on public.priorities
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

-- Customer users can view priorities for their customer
create policy "Customer users can view their priorities"
  on public.priorities
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and p.customer_id = priorities.customer_id
    )
  );

-- Customer users can insert priorities for their customer (suggestions)
create policy "Customer users can create priorities for their customer"
  on public.priorities
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and p.customer_id = priorities.customer_id
    )
  );
