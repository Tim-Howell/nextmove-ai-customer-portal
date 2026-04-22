-- Create a security definer function to get user role without RLS recursion
create or replace function public.get_user_role(user_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = user_id;
$$;

-- Grant execute to authenticated users
grant execute on function public.get_user_role(uuid) to authenticated;

-- Drop existing policies that have recursive checks
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Staff can read all profiles" on public.profiles;
drop policy if exists "Admins can update any profile" on public.profiles;

-- Recreate policies using the helper function
create policy "Admins can read all profiles"
  on public.profiles
  for select
  using (public.get_user_role(auth.uid()) = 'admin');

create policy "Staff can read all profiles"
  on public.profiles
  for select
  using (public.get_user_role(auth.uid()) = 'staff');

create policy "Admins can update any profile"
  on public.profiles
  for update
  using (public.get_user_role(auth.uid()) = 'admin');
