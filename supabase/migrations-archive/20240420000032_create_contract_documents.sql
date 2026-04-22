-- Create contract_documents table for file metadata
create table public.contract_documents (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  content_type text,
  uploaded_by uuid references public.profiles(id),
  uploaded_at timestamptz default now()
);

-- Create index for performance
create index idx_contract_documents_contract_id on public.contract_documents(contract_id);

comment on table public.contract_documents is 'Metadata for documents attached to contracts';
