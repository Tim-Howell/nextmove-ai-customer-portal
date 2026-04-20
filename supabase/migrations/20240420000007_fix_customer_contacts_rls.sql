-- Fix infinite recursion in customer_contacts RLS policies
-- Use the security definer function created in previous migration

-- Drop existing policies
drop policy if exists "Internal users can read all contacts" on public.customer_contacts;
drop policy if exists "Customer users can read own customer contacts" on public.customer_contacts;
drop policy if exists "Internal users can insert contacts" on public.customer_contacts;
drop policy if exists "Internal users can update contacts" on public.customer_contacts;
drop policy if exists "Internal users can delete contacts" on public.customer_contacts;

-- Recreate policies using the security definer function
create policy "Internal users can read all contacts"
  on public.customer_contacts
  for select
  using (public.get_user_role() in ('admin', 'staff'));

create policy "Customer users can read own customer contacts"
  on public.customer_contacts
  for select
  using (
    public.get_user_role() = 'customer_user'
    and customer_id = (select customer_id from public.profiles where id = auth.uid())
  );

create policy "Internal users can insert contacts"
  on public.customer_contacts
  for insert
  with check (public.get_user_role() in ('admin', 'staff'));

create policy "Internal users can update contacts"
  on public.customer_contacts
  for update
  using (public.get_user_role() in ('admin', 'staff'));

create policy "Internal users can delete contacts"
  on public.customer_contacts
  for delete
  using (public.get_user_role() in ('admin', 'staff'));
