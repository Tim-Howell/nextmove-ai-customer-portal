-- Allow customer users to read their own contact record
create policy "Customer users can read own contact"
  on public.customer_contacts
  for select
  using (
    user_id = auth.uid()
  );

-- Allow customer users to read contacts from their customer (for viewing other contacts at same company)
create policy "Customer users can read contacts from their customer"
  on public.customer_contacts
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'customer_user'
        and p.customer_id = customer_contacts.customer_id
    )
  );
