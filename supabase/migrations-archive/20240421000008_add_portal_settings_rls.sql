-- Enable RLS on portal_settings table
alter table public.portal_settings enable row level security;

-- Allow all authenticated users to read portal settings
create policy "Allow authenticated users to read portal settings"
  on public.portal_settings
  for select
  to authenticated
  using (true);

-- Allow only admin users to update portal settings
create policy "Allow admin users to update portal settings"
  on public.portal_settings
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Allow only admin users to insert portal settings
create policy "Allow admin users to insert portal settings"
  on public.portal_settings
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
