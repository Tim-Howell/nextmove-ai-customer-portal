-- Add billing-related fields to contracts table

-- Add new contract_type_id column referencing new contract_types table
alter table public.contracts 
  add column new_contract_type_id uuid references public.contract_types(id);

-- Subscription billing fields
alter table public.contracts
  add column billing_day integer check (billing_day >= 1 and billing_day <= 28),
  add column hours_per_period numeric(10,2);

-- Rollover fields
alter table public.contracts
  add column rollover_enabled boolean default false,
  add column rollover_expiration_days integer,
  add column max_rollover_hours numeric(10,2);

-- Fixed cost field
alter table public.contracts
  add column fixed_cost numeric(12,2);

-- Add comments
comment on column public.contracts.billing_day is 'Day of month (1-28) when subscription hours refresh';
comment on column public.contracts.hours_per_period is 'Hours allocated per billing period for subscriptions';
comment on column public.contracts.rollover_enabled is 'Whether unused hours roll over to next period';
comment on column public.contracts.rollover_expiration_days is 'Days until rollover hours expire (null = end of contract)';
comment on column public.contracts.max_rollover_hours is 'Maximum rollover hours that can accumulate';
comment on column public.contracts.fixed_cost is 'Contract value for fixed cost contracts';

-- Migrate existing contracts from reference_values to new contract_types
update public.contracts c
set new_contract_type_id = ct.id
from public.reference_values rv, public.contract_types ct
where c.contract_type_id = rv.id
  and rv.type = 'contract_type'
  and rv.value = ct.value;

-- For any contracts that didn't match (shouldn't happen), default to on_demand
update public.contracts c
set new_contract_type_id = (select id from public.contract_types where value = 'on_demand')
where c.new_contract_type_id is null;

-- Make the new column not null and drop the old one
alter table public.contracts
  alter column new_contract_type_id set not null;

-- Drop old foreign key and column
alter table public.contracts
  drop constraint contracts_contract_type_id_fkey,
  drop column contract_type_id;

-- Rename new column to contract_type_id
alter table public.contracts
  rename column new_contract_type_id to contract_type_id;

-- Add index
create index idx_contracts_contract_type_id on public.contracts(contract_type_id);

-- Clean up old reference values for contract_type (optional - keep for now in case needed)
-- delete from public.reference_values where type = 'contract_type';
