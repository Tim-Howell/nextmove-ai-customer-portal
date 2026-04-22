-- Add image columns to customers and priorities tables

-- Add logo_url to customers table
alter table public.customers
  add column logo_url text;

-- Add image_url to priorities table  
alter table public.priorities
  add column image_url text;

-- Add comments
comment on column public.customers.logo_url is 'URL to customer logo in storage';
comment on column public.priorities.image_url is 'URL to priority image in storage';
