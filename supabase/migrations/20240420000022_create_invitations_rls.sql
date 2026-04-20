-- RLS Policies for customer_invitations table

-- Admin and staff can read all invitations
create policy "Admin and staff can read invitations"
  on public.customer_invitations
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- Admin and staff can create invitations
create policy "Admin and staff can create invitations"
  on public.customer_invitations
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- Admin and staff can update invitations
create policy "Admin and staff can update invitations"
  on public.customer_invitations
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );
