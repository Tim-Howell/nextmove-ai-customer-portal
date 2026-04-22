-- Add is_default column to contracts table
alter table public.contracts
  add column is_default boolean not null default false;

-- Create index for default contract lookup
create index idx_contracts_is_default on public.contracts(customer_id, is_default) where is_default = true;

-- Add comment
comment on column public.contracts.is_default is 'Whether this is the default "On-Demand / Off Contract" contract for the customer';

-- Create default contracts for all existing customers
-- First, get the "active" status ID and contract type
do $$
declare
  active_status_id uuid;
  hours_sub_type_id uuid;
begin
  -- Get the active status reference value
  select id into active_status_id from public.reference_values 
  where type = 'contract_status' and value = 'active' limit 1;
  
  -- Get the hours_subscription contract type reference value (default type)
  select id into hours_sub_type_id from public.reference_values 
  where type = 'contract_type' and value = 'hours_subscription' limit 1;
  
  -- Raise error if required values not found
  if active_status_id is null then
    raise exception 'Could not find active contract status';
  end if;
  if hours_sub_type_id is null then
    raise exception 'Could not find hours_subscription contract type';
  end if;
  
  -- Insert default contract for each customer that doesn't have one
  insert into public.contracts (customer_id, name, contract_type_id, status_id, is_default, start_date)
  select 
    c.id,
    'On-Demand / Off Contract',
    hours_sub_type_id,
    active_status_id,
    true,
    current_date
  from public.customers c
  where not exists (
    select 1 from public.contracts ct 
    where ct.customer_id = c.id and ct.is_default = true
  );
end $$;
