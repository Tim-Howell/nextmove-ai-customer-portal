-- Fix infinite recursion in customers RLS policies
-- Use security definer function to bypass RLS when checking role

-- Create a security definer function to get user role without RLS
create or replace function public.get_user_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Drop existing policies
drop policy if exists "Internal users can read all customers" on public.customers;
drop policy if exists "Customer users can read own customer" on public.customers;
drop policy if exists "Internal users can insert customers" on public.customers;
drop policy if exists "Internal users can update customers" on public.customers;
drop policy if exists "Admins can delete customers" on public.customers;

-- Recreate policies using the security definer function
create policy "Internal users can read all customers"
  on public.customers
  for select
  using (public.get_user_role() in ('admin', 'staff'));

create policy "Customer users can read own customer"
  on public.customers
  for select
  using (
    public.get_user_role() = 'customer_user'
    and id = (select customer_id from public.profiles where id = auth.uid())
  );

create policy "Internal users can insert customers"
  on public.customers
  for insert
  with check (public.get_user_role() in ('admin', 'staff'));

create policy "Internal users can update customers"
  on public.customers
  for update
  using (public.get_user_role() in ('admin', 'staff'));

create policy "Admins can delete customers"
  on public.customers
  for delete
  using (public.get_user_role() = 'admin');
