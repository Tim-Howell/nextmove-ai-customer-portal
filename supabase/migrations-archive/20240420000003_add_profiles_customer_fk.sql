-- Add foreign key constraint from profiles.customer_id to customers.id
-- This links customer_user profiles to their customer account

alter table public.profiles
  add constraint profiles_customer_id_fkey
  foreign key (customer_id) references public.customers(id) on delete set null;

-- Add comment
comment on column public.profiles.customer_id is 'For customer_user role, links to their customer account in customers table';
