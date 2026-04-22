-- Add entered_by column to time_entries table
-- This tracks who created the time entry (may differ from staff_id who performed the work)

alter table public.time_entries
  add column entered_by uuid references public.profiles(id);

-- Set entered_by to staff_id for existing entries (assume self-entry)
update public.time_entries
set entered_by = staff_id
where entered_by is null;

-- Add comment
comment on column public.time_entries.entered_by is 'User who created this time entry (may differ from staff_id)';
