-- Add user_id column to customer_contacts for linking to auth users
alter table public.customer_contacts
  add column user_id uuid references auth.users(id);

-- Create index for user lookup
create index customer_contacts_user_id_idx on public.customer_contacts(user_id);

-- Add comment
comment on column public.customer_contacts.user_id is 'Links contact to auth user for portal access';
