-- RLS Policies for profiles table

-- Policy: Users can read their own profile
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy: Admins can read all profiles
create policy "Admins can read all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Staff can read all profiles (needed for internal operations)
create policy "Staff can read all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'staff'
    )
  );

-- Policy: Users can update their own profile (limited fields)
-- Note: Role changes are handled separately by admins
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policy: Admins can update any profile
create policy "Admins can update any profile"
  on public.profiles
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Only the trigger can insert profiles (via security definer)
-- No direct insert policy needed as profiles are created by trigger
