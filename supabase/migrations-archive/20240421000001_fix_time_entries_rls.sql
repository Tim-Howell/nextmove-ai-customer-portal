-- Fix RLS policies for customer users
-- Use profiles.customer_id instead of customer_contacts join

-- ============================================
-- TIME_ENTRIES TABLE
-- ============================================
drop policy if exists "Customer users can view their time entries" on public.time_entries;

create policy "Customer users can view their time entries"
  on public.time_entries for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and p.customer_id = time_entries.customer_id
    )
  );

-- ============================================
-- CONTRACTS TABLE
-- ============================================
drop policy if exists "Customer users can view their contracts" on public.contracts;

create policy "Customer users can view their contracts"
  on public.contracts for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and p.customer_id = contracts.customer_id
    )
  );

-- ============================================
-- CONTRACT_DOCUMENTS TABLE
-- ============================================
drop policy if exists "Customer users can view their contract documents" on public.contract_documents;

create policy "Customer users can view their contract documents"
  on public.contract_documents for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      join public.contracts c on c.customer_id = p.customer_id
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and c.id = contract_documents.contract_id
    )
  );

-- ============================================
-- PRIORITIES TABLE
-- ============================================
drop policy if exists "Customer users can view their priorities" on public.priorities;

create policy "Customer users can view their priorities"
  on public.priorities for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and p.customer_id = priorities.customer_id
    )
  );
