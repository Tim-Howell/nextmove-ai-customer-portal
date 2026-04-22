-- RLS Policies for customer_contacts table

-- Policy: Internal users (admin, staff) can read all contacts
create policy "Internal users can read all contacts"
  on public.customer_contacts
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- Policy: Customer users can read their own customer's contacts
create policy "Customer users can read own customer contacts"
  on public.customer_contacts
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() 
        and role = 'customer_user' 
        and customer_id = customer_contacts.customer_id
    )
  );

-- Policy: Internal users can insert contacts
create policy "Internal users can insert contacts"
  on public.customer_contacts
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- Policy: Internal users can update contacts
create policy "Internal users can update contacts"
  on public.customer_contacts
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- Policy: Internal users can delete contacts
create policy "Internal users can delete contacts"
  on public.customer_contacts
  for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );
