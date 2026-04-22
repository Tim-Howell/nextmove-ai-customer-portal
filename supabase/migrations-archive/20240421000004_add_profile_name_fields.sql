-- Add name fields to profiles table
alter table public.profiles
  add column first_name text,
  add column last_name text,
  add column title text;

-- Create index for name search
create index idx_profiles_name on public.profiles(first_name, last_name) where first_name is not null and last_name is not null;

-- Add comments
comment on column public.profiles.first_name is 'First name of the user';
comment on column public.profiles.last_name is 'Last name of the user';
comment on column public.profiles.title is 'Job title or position';

-- Update existing profiles to split full_name into first and last name
-- This will be a one-time migration for existing data
update public.profiles
set 
  first_name = case 
    when position(' ' in full_name) > 0 
    then substring(full_name from 1 for position(' ' in full_name) - 1)
    else full_name
  end,
  last_name = case 
    when position(' ' in full_name) > 0 
    then substring(full_name from position(' ' in full_name) + 1)
    else null
  end
where first_name is null and full_name is not null;
