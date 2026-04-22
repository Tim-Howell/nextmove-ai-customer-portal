-- Create profiles table
-- This table extends Supabase auth.users with application-specific data

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'staff' check (role in ('admin', 'staff', 'customer_user')),
  customer_id uuid, -- Will reference customers table when created in Phase 3
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for role-based queries
create index profiles_role_idx on public.profiles(role);

-- Create index for customer_id lookups
create index profiles_customer_id_idx on public.profiles(customer_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Add comment for documentation
comment on table public.profiles is 'User profiles extending Supabase auth with application roles';
comment on column public.profiles.role is 'User role: admin, staff, or customer_user';
comment on column public.profiles.customer_id is 'For customer_user role, links to their customer account';
