-- Create customer_invitations table for tracking portal invitations
create table public.customer_invitations (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.customer_contacts(id) on delete cascade,
  email text not null,
  invited_by uuid not null references public.profiles(id),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

-- Create indexes
create index customer_invitations_contact_id_idx on public.customer_invitations(contact_id);
create index customer_invitations_email_idx on public.customer_invitations(email);

-- Enable Row Level Security
alter table public.customer_invitations enable row level security;

-- Add comments
comment on table public.customer_invitations is 'Tracks portal access invitations sent to customer contacts';
comment on column public.customer_invitations.contact_id is 'The customer contact being invited';
comment on column public.customer_invitations.invited_by is 'Staff/admin who sent the invitation';
comment on column public.customer_invitations.accepted_at is 'When the invitation was accepted (null if pending)';
comment on column public.customer_invitations.expires_at is 'When the invitation expires';
