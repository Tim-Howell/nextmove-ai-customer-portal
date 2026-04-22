-- Fix all RLS policies to avoid infinite recursion
-- This migration consolidates all RLS fixes

-- ============================================
-- PROFILES TABLE
-- ============================================
drop policy if exists "Staff can read all profiles" on public.profiles;
drop policy if exists "Admins can update any profile" on public.profiles;
drop policy if exists "Authenticated users can read profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;

create policy "Users can read own profile"
  on public.profiles
  for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles
  for update
  using (id = auth.uid());

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
drop policy if exists "Internal users can read all customers" on public.customers;
drop policy if exists "Customer users can read own customer" on public.customers;
drop policy if exists "Internal users can insert customers" on public.customers;
drop policy if exists "Internal users can update customers" on public.customers;
drop policy if exists "Admins can delete customers" on public.customers;
drop policy if exists "Authenticated can read customers" on public.customers;
drop policy if exists "Authenticated can insert customers" on public.customers;
drop policy if exists "Authenticated can update customers" on public.customers;
drop policy if exists "Authenticated can delete customers" on public.customers;

create policy "Authenticated can read customers"
  on public.customers for select
  using (auth.uid() is not null);

create policy "Authenticated can insert customers"
  on public.customers for insert
  with check (auth.uid() is not null);

create policy "Authenticated can update customers"
  on public.customers for update
  using (auth.uid() is not null);

create policy "Authenticated can delete customers"
  on public.customers for delete
  using (auth.uid() is not null);

-- ============================================
-- CUSTOMER_CONTACTS TABLE
-- ============================================
drop policy if exists "Internal users can read all contacts" on public.customer_contacts;
drop policy if exists "Customer users can read own customer contacts" on public.customer_contacts;
drop policy if exists "Internal users can insert contacts" on public.customer_contacts;
drop policy if exists "Internal users can update contacts" on public.customer_contacts;
drop policy if exists "Internal users can delete contacts" on public.customer_contacts;
drop policy if exists "Authenticated can read contacts" on public.customer_contacts;
drop policy if exists "Authenticated can insert contacts" on public.customer_contacts;
drop policy if exists "Authenticated can update contacts" on public.customer_contacts;
drop policy if exists "Authenticated can delete contacts" on public.customer_contacts;

create policy "Authenticated can read contacts"
  on public.customer_contacts for select
  using (auth.uid() is not null);

create policy "Authenticated can insert contacts"
  on public.customer_contacts for insert
  with check (auth.uid() is not null);

create policy "Authenticated can update contacts"
  on public.customer_contacts for update
  using (auth.uid() is not null);

create policy "Authenticated can delete contacts"
  on public.customer_contacts for delete
  using (auth.uid() is not null);
