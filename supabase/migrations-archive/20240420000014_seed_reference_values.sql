-- Seed default reference values

-- Contract Types
insert into public.reference_values (type, value, label, sort_order, is_default) values
  ('contract_type', 'hours_subscription', 'Hours Subscription', 1, true),
  ('contract_type', 'hours_bucket', 'Hours Bucket', 2, false),
  ('contract_type', 'fixed_cost', 'Fixed Cost', 3, false),
  ('contract_type', 'service_subscription', 'Service Subscription', 4, false);

-- Contract Statuses
insert into public.reference_values (type, value, label, sort_order, is_default) values
  ('contract_status', 'draft', 'Draft', 1, true),
  ('contract_status', 'active', 'Active', 2, false),
  ('contract_status', 'expired', 'Expired', 3, false),
  ('contract_status', 'closed', 'Closed', 4, false);

-- Time Categories
insert into public.reference_values (type, value, label, sort_order, is_default) values
  ('time_category', 'administrative', 'Administrative', 1, false),
  ('time_category', 'research', 'Research', 2, false),
  ('time_category', 'technical', 'Technical', 3, true),
  ('time_category', 'meetings', 'Meetings / Presentations', 4, false);

-- Priority Statuses
insert into public.reference_values (type, value, label, sort_order, is_default) values
  ('priority_status', 'backlog', 'Backlog', 1, true),
  ('priority_status', 'next_up', 'Next Up', 2, false),
  ('priority_status', 'active', 'Active', 3, false),
  ('priority_status', 'complete', 'Complete', 4, false),
  ('priority_status', 'on_hold', 'On Hold', 5, false);

-- Priority Levels
insert into public.reference_values (type, value, label, sort_order, is_default) values
  ('priority_level', 'high', 'High', 1, false),
  ('priority_level', 'medium', 'Medium', 2, true),
  ('priority_level', 'low', 'Low', 3, false);

-- Request Statuses
insert into public.reference_values (type, value, label, sort_order, is_default) values
  ('request_status', 'new', 'New', 1, true),
  ('request_status', 'in_review', 'In Review', 2, false),
  ('request_status', 'in_progress', 'In Progress', 3, false),
  ('request_status', 'closed', 'Closed', 4, false);
