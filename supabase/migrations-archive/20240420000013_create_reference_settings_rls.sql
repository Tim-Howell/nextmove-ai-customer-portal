-- RLS Policies for reference_values table

-- All authenticated users can read active reference values
create policy "Authenticated can read reference values"
  on public.reference_values
  for select
  using (auth.uid() is not null);

-- Only admins can insert reference values
create policy "Admins can insert reference values"
  on public.reference_values
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can update reference values
create policy "Admins can update reference values"
  on public.reference_values
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can delete reference values
create policy "Admins can delete reference values"
  on public.reference_values
  for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for system_settings table

-- Only admins can read system settings
create policy "Admins can read system settings"
  on public.system_settings
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can update system settings
create policy "Admins can update system settings"
  on public.system_settings
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can insert system settings
create policy "Admins can insert system settings"
  on public.system_settings
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
