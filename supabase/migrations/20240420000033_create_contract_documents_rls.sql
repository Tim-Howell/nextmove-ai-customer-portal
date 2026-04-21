-- Enable RLS on contract_documents
alter table public.contract_documents enable row level security;

-- Internal users have full access
create policy "Internal users can view all contract documents"
  on public.contract_documents for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

create policy "Internal users can insert contract documents"
  on public.contract_documents for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

create policy "Internal users can delete contract documents"
  on public.contract_documents for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

-- Customer users can view documents for their contracts
create policy "Customer users can view their contract documents"
  on public.contract_documents for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      join public.customer_contacts cc on cc.user_id = p.id
      join public.contracts c on c.customer_id = cc.customer_id
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and c.id = contract_documents.contract_id
    )
  );
