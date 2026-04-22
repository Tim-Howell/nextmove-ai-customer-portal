-- RLS Policies for customers table

-- Policy: Internal users (admin, staff) can read all customers
create policy "Internal users can read all customers"
  on public.customers
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- Policy: Customer users can read their own customer
create policy "Customer users can read own customer"
  on public.customers
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() 
        and role = 'customer_user' 
        and customer_id = customers.id
    )
  );

-- Policy: Internal users can insert customers
create policy "Internal users can insert customers"
  on public.customers
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- Policy: Internal users can update customers
create policy "Internal users can update customers"
  on public.customers
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- Policy: Only admins can delete customers
create policy "Admins can delete customers"
  on public.customers
  for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
