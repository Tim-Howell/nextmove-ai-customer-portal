-- Enable RLS on contracts
alter table public.contracts enable row level security;

-- Internal users (admin, staff) have full access
create policy "Internal users can view all contracts"
  on public.contracts for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

create policy "Internal users can insert contracts"
  on public.contracts for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

create policy "Internal users can update contracts"
  on public.contracts for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

create policy "Admin users can delete contracts"
  on public.contracts for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Customer users can view their own contracts
create policy "Customer users can view their contracts"
  on public.contracts for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      join public.customer_contacts cc on cc.user_id = p.id
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and cc.customer_id = contracts.customer_id
    )
  );
