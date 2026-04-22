-- Add internal_notes columns to tables

-- Add to customers table
alter table public.customers
  add column internal_notes text;

-- Add to priorities table
alter table public.priorities
  add column internal_notes text;

-- Add to time_entries table
alter table public.time_entries
  add column internal_notes text;

-- Add comments
comment on column public.customers.internal_notes is 'Internal notes about the customer (visible to admin/staff only)';
comment on column public.priorities.internal_notes is 'Internal notes about the priority (visible to admin/staff only)';
comment on column public.time_entries.internal_notes is 'Internal notes about the time entry (visible to admin/staff only)';
