-- Create storage bucket for portal documents
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portal-documents',
  'portal-documents',
  false,
  10485760, -- 10MB limit
  array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/gif', 'text/plain']
);

-- Storage policies for portal-documents bucket

-- Internal users can upload files
create policy "Internal users can upload documents"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portal-documents'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

-- Internal users can view all files
create policy "Internal users can view all documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'portal-documents'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

-- Internal users can delete files
create policy "Internal users can delete documents"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'portal-documents'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );

-- Customer users can view documents for their contracts
create policy "Customer users can view their contract documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'portal-documents'
    and exists (
      select 1 from public.profiles p
      join public.customer_contacts cc on cc.user_id = p.id
      join public.contracts c on c.customer_id = cc.customer_id
      join public.contract_documents cd on cd.contract_id = c.id
      where p.id = auth.uid()
      and p.role = 'customer_user'
      and cd.file_path = name
    )
  );
