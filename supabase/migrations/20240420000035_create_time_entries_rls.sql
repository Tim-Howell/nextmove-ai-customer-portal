-- Enable RLS on time_entries
alter table public.time_entries enable row level security;

-- Internal users have full access
create policy "Internal users can view all time entries"
  on public.time_entries for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

create policy "Internal users can insert time entries"
  on public.time_entries for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

create policy "Internal users can update time entries"
  on public.time_entries for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

create policy "Internal users can delete time entries"
  on public.time_entries for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

-- Customer users can view their own time entries
create policy "Customer users can view their time entries"
  on public.time_entries for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      join public.customer_contacts cc on cc.user_id = p.id
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and cc.customer_id = time_entries.customer_id
    )
  );
