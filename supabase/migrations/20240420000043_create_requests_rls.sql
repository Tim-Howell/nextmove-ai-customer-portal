-- Enable RLS on requests
alter table public.requests enable row level security;

-- Internal users (admin, staff) can do everything
create policy "Internal users have full access to requests"
  on public.requests
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

-- Customer users can view requests for their customer
create policy "Customer users can view their requests"
  on public.requests
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and p.customer_id = requests.customer_id
    )
  );

-- Customer users can insert requests for their customer
create policy "Customer users can create requests for their customer"
  on public.requests
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and p.customer_id = requests.customer_id
    )
  );
