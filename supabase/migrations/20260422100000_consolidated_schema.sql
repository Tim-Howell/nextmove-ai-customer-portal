-- ============================================================================
-- NextMove AI Customer Portal - Consolidated Schema Migration
-- Generated: 2026-04-22
-- This single migration creates the complete database schema
-- ============================================================================

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function to get user role without RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  first_name text,
  last_name text,
  title text,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'customer_user')),
  customer_id uuid,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX profiles_role_idx ON public.profiles(role);
CREATE INDEX profiles_customer_id_idx ON public.profiles(customer_id);
CREATE INDEX profiles_is_active_idx ON public.profiles(is_active);
CREATE INDEX idx_profiles_name ON public.profiles(first_name, last_name) WHERE first_name IS NOT NULL AND last_name IS NOT NULL;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth with application roles';
COMMENT ON COLUMN public.profiles.role IS 'User role: admin, staff, or customer_user';
COMMENT ON COLUMN public.profiles.customer_id IS 'For customer_user role, links to their customer account';
COMMENT ON COLUMN public.profiles.is_active IS 'Whether this user account is active';

-- Profile trigger for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles RLS Policies
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Staff can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'staff');

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  primary_contact_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  secondary_contact_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes text,
  internal_notes text,
  logo_url text,
  is_demo boolean NOT NULL DEFAULT false,
  archived_at timestamptz DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX customers_status_idx ON public.customers(status);
CREATE INDEX customers_name_idx ON public.customers(name);
CREATE INDEX customers_is_demo_idx ON public.customers(is_demo);
CREATE INDEX idx_customers_archived_at ON public.customers(archived_at);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.customers IS 'Customer accounts managed by NextMove AI';
COMMENT ON COLUMN public.customers.status IS 'Customer status: active, inactive, or archived';
COMMENT ON COLUMN public.customers.primary_contact_id IS 'Primary NextMove AI staff contact for this customer';
COMMENT ON COLUMN public.customers.secondary_contact_id IS 'Secondary NextMove AI staff contact for this customer';
COMMENT ON COLUMN public.customers.internal_notes IS 'Internal notes about the customer (visible to admin/staff only)';
COMMENT ON COLUMN public.customers.is_demo IS 'Whether this is demo data';
COMMENT ON COLUMN public.customers.archived_at IS 'Timestamp when customer was archived. NULL means active.';

-- Add FK from profiles to customers
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_customer_id_fkey
  FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;

-- Customers RLS Policies
CREATE POLICY "Authenticated can read customers"
  ON public.customers FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update customers"
  ON public.customers FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete customers"
  ON public.customers FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- CUSTOMER_CONTACTS TABLE
-- ============================================================================

CREATE TABLE public.customer_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  first_name text,
  last_name text,
  title text,
  email text,
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  portal_access_enabled boolean NOT NULL DEFAULT false,
  is_demo boolean NOT NULL DEFAULT false,
  is_archived boolean DEFAULT false,
  archived_at timestamptz DEFAULT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX customer_contacts_customer_id_idx ON public.customer_contacts(customer_id);
CREATE INDEX customer_contacts_is_active_idx ON public.customer_contacts(is_active);
CREATE INDEX customer_contacts_user_id_idx ON public.customer_contacts(user_id);
CREATE INDEX customer_contacts_is_demo_idx ON public.customer_contacts(is_demo);
CREATE INDEX idx_customer_contacts_archived_at ON public.customer_contacts(archived_at);

ALTER TABLE public.customer_contacts ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER customer_contacts_updated_at
  BEFORE UPDATE ON public.customer_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.customer_contacts IS 'Contact people associated with customer accounts';
COMMENT ON COLUMN public.customer_contacts.is_active IS 'Whether this contact is currently active';
COMMENT ON COLUMN public.customer_contacts.portal_access_enabled IS 'Whether this contact is eligible for portal access';
COMMENT ON COLUMN public.customer_contacts.user_id IS 'Links contact to auth user for portal access';
COMMENT ON COLUMN public.customer_contacts.archived_at IS 'Timestamp when contact was archived. NULL means active.';
COMMENT ON COLUMN public.customer_contacts.is_archived IS 'Whether contact is archived (redundant with archived_at for quick filtering).';

-- Customer Contacts RLS Policies
CREATE POLICY "Authenticated can read contacts"
  ON public.customer_contacts FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can insert contacts"
  ON public.customer_contacts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update contacts"
  ON public.customer_contacts FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete contacts"
  ON public.customer_contacts FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- REFERENCE_VALUES TABLE
-- ============================================================================

CREATE TABLE public.reference_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  value text NOT NULL,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_default boolean NOT NULL DEFAULT false,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(type, value)
);

CREATE INDEX reference_values_type_idx ON public.reference_values(type);
CREATE INDEX reference_values_type_active_idx ON public.reference_values(type, is_active);

ALTER TABLE public.reference_values ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER reference_values_updated_at
  BEFORE UPDATE ON public.reference_values
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.reference_values IS 'System reference values for dropdowns and selects';
COMMENT ON COLUMN public.reference_values.type IS 'Category: contract_status, time_category, priority_status, priority_level, request_status';
COMMENT ON COLUMN public.reference_values.value IS 'Internal value used in code';
COMMENT ON COLUMN public.reference_values.label IS 'Display label shown to users';
COMMENT ON COLUMN public.reference_values.sort_order IS 'Order for display in dropdowns';
COMMENT ON COLUMN public.reference_values.is_default IS 'Whether this is the default selection for new records';
COMMENT ON COLUMN public.reference_values.is_demo IS 'Whether this is demo data';

-- Reference Values RLS Policies
CREATE POLICY "Reference values are viewable by authenticated users"
  ON public.reference_values FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Reference values are modifiable by admins"
  ON public.reference_values FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- CONTRACT_TYPES TABLE
-- ============================================================================

CREATE TABLE public.contract_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  tracks_hours boolean DEFAULT true,
  has_hour_limit boolean DEFAULT false,
  is_recurring boolean DEFAULT false,
  supports_rollover boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.contract_types ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER contract_types_updated_at
  BEFORE UPDATE ON public.contract_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.contract_types IS 'Contract type definitions with behavior configuration';

CREATE POLICY "Contract types are viewable by authenticated users"
  ON public.contract_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Contract types are modifiable by admins"
  ON public.contract_types FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- SYSTEM_SETTINGS TABLE
-- ============================================================================

CREATE TABLE public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.system_settings IS 'System-wide configuration settings';
COMMENT ON COLUMN public.system_settings.key IS 'Setting identifier';
COMMENT ON COLUMN public.system_settings.value IS 'Setting value as JSON';

CREATE POLICY "System settings are viewable by authenticated users"
  ON public.system_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System settings are modifiable by admins"
  ON public.system_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- PORTAL_SETTINGS TABLE
-- ============================================================================

CREATE TABLE public.portal_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name text NOT NULL DEFAULT 'NextMove AI',
  website_url text,
  logo_url text,
  description text,
  primary_color text DEFAULT '#3b82f6',
  secondary_color text DEFAULT '#64748b',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.portal_settings IS 'Portal branding and customization settings';
COMMENT ON COLUMN public.portal_settings.organization_name IS 'Organization name displayed in the portal';
COMMENT ON COLUMN public.portal_settings.website_url IS 'Organization website URL';
COMMENT ON COLUMN public.portal_settings.logo_url IS 'URL to organization logo in storage';

CREATE OR REPLACE FUNCTION public.update_portal_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portal_settings_updated_at
  BEFORE UPDATE ON public.portal_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_portal_settings_updated_at();

CREATE POLICY "Portal settings are viewable by authenticated users"
  ON public.portal_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Portal settings are modifiable by admins"
  ON public.portal_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- CONTRACTS TABLE
-- ============================================================================

CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  contract_type_id uuid NOT NULL REFERENCES public.contract_types(id),
  status_id uuid NOT NULL REFERENCES public.reference_values(id),
  start_date date,
  end_date date,
  total_hours numeric(10,2),
  hours_per_period numeric(10,2),
  billing_day integer CHECK (billing_day >= 1 AND billing_day <= 28),
  rollover_enabled boolean DEFAULT false,
  rollover_expiration_days integer,
  max_rollover_hours numeric(10,2),
  fixed_cost numeric(12,2),
  description text,
  archived_at timestamptz DEFAULT NULL,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_contracts_customer_id ON public.contracts(customer_id);
CREATE INDEX idx_contracts_status_id ON public.contracts(status_id);
CREATE INDEX idx_contracts_contract_type_id ON public.contracts(contract_type_id);
CREATE INDEX idx_contracts_archived_at ON public.contracts(archived_at);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.contracts IS 'Customer contracts for tracking agreements and hours';
COMMENT ON COLUMN public.contracts.billing_day IS 'Day of month (1-28) when subscription hours refresh';
COMMENT ON COLUMN public.contracts.hours_per_period IS 'Hours allocated per billing period for subscriptions';
COMMENT ON COLUMN public.contracts.rollover_enabled IS 'Whether unused hours roll over to next period';
COMMENT ON COLUMN public.contracts.rollover_expiration_days IS 'Days until rollover hours expire (null = end of contract)';
COMMENT ON COLUMN public.contracts.max_rollover_hours IS 'Maximum rollover hours that can accumulate';
COMMENT ON COLUMN public.contracts.fixed_cost IS 'Contract value for fixed cost contracts';
COMMENT ON COLUMN public.contracts.archived_at IS 'Timestamp when contract was archived. NULL means active.';

-- Contracts RLS Policies
CREATE POLICY "Contracts are viewable by authenticated users"
  ON public.contracts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Contracts are insertable by internal users"
  ON public.contracts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Contracts are updatable by internal users"
  ON public.contracts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Contracts are deletable by admins"
  ON public.contracts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- CONTRACT_DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE public.contract_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  content_type text,
  uploaded_by uuid REFERENCES public.profiles(id),
  uploaded_at timestamptz DEFAULT now()
);

CREATE INDEX idx_contract_documents_contract_id ON public.contract_documents(contract_id);

ALTER TABLE public.contract_documents ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.contract_documents IS 'Metadata for documents attached to contracts';

CREATE POLICY "Contract documents are viewable by authenticated users"
  ON public.contract_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Contract documents are insertable by internal users"
  ON public.contract_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Contract documents are deletable by internal users"
  ON public.contract_documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- ============================================================================
-- TIME_ENTRIES TABLE
-- ============================================================================

CREATE TABLE public.time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,
  staff_id uuid NOT NULL REFERENCES public.profiles(id),
  entered_by uuid REFERENCES public.profiles(id),
  entry_date date NOT NULL,
  hours numeric(5,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  category_id uuid NOT NULL REFERENCES public.reference_values(id),
  description text,
  internal_notes text,
  is_billable boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_time_entries_customer_id ON public.time_entries(customer_id);
CREATE INDEX idx_time_entries_contract_id ON public.time_entries(contract_id);
CREATE INDEX idx_time_entries_staff_id ON public.time_entries(staff_id);
CREATE INDEX idx_time_entries_entry_date ON public.time_entries(entry_date);
CREATE INDEX idx_time_entries_category_id ON public.time_entries(category_id);

ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER time_entries_updated_at
  BEFORE UPDATE ON public.time_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.time_entries IS 'Time logged against customers and contracts';
COMMENT ON COLUMN public.time_entries.entered_by IS 'User who created this time entry (may differ from staff_id)';
COMMENT ON COLUMN public.time_entries.internal_notes IS 'Internal notes about the time entry (visible to admin/staff only)';

-- Time Entries RLS Policies
CREATE POLICY "Time entries are viewable by authenticated users"
  ON public.time_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Time entries are insertable by internal users"
  ON public.time_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Time entries are updatable by internal users"
  ON public.time_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Time entries are deletable by internal users"
  ON public.time_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- ============================================================================
-- PRIORITIES TABLE
-- ============================================================================

CREATE TABLE public.priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  internal_notes text,
  image_url text,
  status_id uuid NOT NULL REFERENCES public.reference_values(id),
  priority_level_id uuid NOT NULL REFERENCES public.reference_values(id),
  due_date date,
  is_read_only boolean DEFAULT false,
  created_by uuid REFERENCES public.profiles(id),
  updated_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_priorities_customer_id ON public.priorities(customer_id);
CREATE INDEX idx_priorities_status_id ON public.priorities(status_id);
CREATE INDEX idx_priorities_priority_level_id ON public.priorities(priority_level_id);
CREATE INDEX idx_priorities_created_by ON public.priorities(created_by);
CREATE INDEX idx_priorities_is_read_only ON public.priorities(is_read_only);

ALTER TABLE public.priorities ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER set_priorities_updated_at
  BEFORE UPDATE ON public.priorities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON COLUMN public.priorities.internal_notes IS 'Internal notes about the priority (visible to admin/staff only)';
COMMENT ON COLUMN public.priorities.image_url IS 'URL to priority image in storage';
COMMENT ON COLUMN public.priorities.is_read_only IS 'Whether priority is read-only (e.g., customer archived).';

-- Priorities RLS Policies
CREATE POLICY "Priorities are viewable by authenticated users"
  ON public.priorities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Priorities are insertable by internal users"
  ON public.priorities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Priorities are updatable by internal users"
  ON public.priorities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Priorities are deletable by admins"
  ON public.priorities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- REQUESTS TABLE
-- ============================================================================

CREATE TABLE public.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  submitted_by uuid REFERENCES public.profiles(id),
  title text NOT NULL,
  description text,
  status_id uuid NOT NULL REFERENCES public.reference_values(id),
  internal_notes text,
  is_read_only boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_requests_customer_id ON public.requests(customer_id);
CREATE INDEX idx_requests_status_id ON public.requests(status_id);
CREATE INDEX idx_requests_submitted_by ON public.requests(submitted_by);
CREATE INDEX idx_requests_is_read_only ON public.requests(is_read_only);

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER set_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON COLUMN public.requests.is_read_only IS 'Whether request is read-only (e.g., customer archived).';

-- Requests RLS Policies
CREATE POLICY "Requests are viewable by authenticated users"
  ON public.requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Requests are insertable by authenticated users"
  ON public.requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Requests are updatable by internal users"
  ON public.requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Requests are deletable by internal users"
  ON public.requests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- ============================================================================
-- AUDIT_LOGS TABLE
-- ============================================================================

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'archive', 'restore')),
  user_id uuid REFERENCES public.profiles(id),
  user_email text,
  user_role text,
  old_values jsonb,
  new_values jsonb,
  changed_fields text[],
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.audit_logs IS 'Tracks all changes made to audited tables';
COMMENT ON COLUMN public.audit_logs.action IS 'Type of change: create, update, delete, archive, restore';
COMMENT ON COLUMN public.audit_logs.changed_fields IS 'List of field names that changed (for updates)';

CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- AUDIT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
  audit_user_id UUID;
  audit_user_email TEXT;
  audit_user_role TEXT;
  old_data JSONB;
  new_data JSONB;
  changed_cols TEXT[];
  col_name TEXT;
  action_type TEXT;
  has_archived_at BOOLEAN;
BEGIN
  audit_user_id := NULLIF(current_setting('app.current_user_id', true), '')::UUID;
  audit_user_email := NULLIF(current_setting('app.current_user_email', true), '');
  audit_user_role := NULLIF(current_setting('app.current_user_role', true), '');

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = TG_TABLE_SCHEMA 
    AND table_name = TG_TABLE_NAME 
    AND column_name = 'archived_at'
  ) INTO has_archived_at;

  IF TG_OP = 'INSERT' THEN
    action_type := 'create';
    new_data := to_jsonb(NEW);
    old_data := NULL;
    changed_cols := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    
    IF has_archived_at THEN
      IF (new_data->>'archived_at') IS NOT NULL AND ((old_data->>'archived_at') IS NULL OR (old_data->>'archived_at') != (new_data->>'archived_at')) THEN
        action_type := 'archive';
      ELSIF (new_data->>'archived_at') IS NULL AND (old_data->>'archived_at') IS NOT NULL THEN
        action_type := 'restore';
      ELSE
        action_type := 'update';
      END IF;
    ELSE
      action_type := 'update';
    END IF;
    
    changed_cols := ARRAY[]::TEXT[];
    FOR col_name IN SELECT key FROM jsonb_object_keys(new_data) AS key
    LOOP
      IF old_data->col_name IS DISTINCT FROM new_data->col_name THEN
        changed_cols := array_append(changed_cols, col_name);
      END IF;
    END LOOP;
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete';
    old_data := to_jsonb(OLD);
    new_data := NULL;
    changed_cols := NULL;
  END IF;

  INSERT INTO public.audit_logs (
    table_name, record_id, action, user_id, user_email, user_role,
    old_values, new_values, changed_fields
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE((new_data->>'id')::UUID, (old_data->>'id')::UUID),
    action_type, audit_user_id, audit_user_email, audit_user_role,
    old_data, new_data, changed_cols
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.audit_trigger_func() IS 'Generic audit trigger function that logs changes to audit_logs table.';

-- Create audit triggers for all tables
CREATE TRIGGER audit_customers
  AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_customer_contacts
  AFTER INSERT OR UPDATE OR DELETE ON public.customer_contacts
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_contracts
  AFTER INSERT OR UPDATE OR DELETE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_time_entries
  AFTER INSERT OR UPDATE OR DELETE ON public.time_entries
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_priorities
  AFTER INSERT OR UPDATE OR DELETE ON public.priorities
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_requests
  AFTER INSERT OR UPDATE OR DELETE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_profiles
  AFTER UPDATE ON public.profiles
  FOR EACH ROW 
  WHEN (OLD.role IS DISTINCT FROM NEW.role OR OLD.is_active IS DISTINCT FROM NEW.is_active)
  EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_portal_settings
  AFTER INSERT OR UPDATE OR DELETE ON public.portal_settings
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_reference_values
  AFTER INSERT OR UPDATE OR DELETE ON public.reference_values
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_contract_types
  AFTER INSERT OR UPDATE OR DELETE ON public.contract_types
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Function to set audit context from application
CREATE OR REPLACE FUNCTION public.set_audit_context(
  p_user_id UUID,
  p_user_email TEXT,
  p_user_role TEXT
)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', p_user_id::TEXT, true);
  PERFORM set_config('app.current_user_email', COALESCE(p_user_email, ''), true);
  PERFORM set_config('app.current_user_role', COALESCE(p_user_role, ''), true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STORAGE BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('contract-documents', 'contract-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload contract documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contract-documents');

CREATE POLICY "Authenticated users can view contract documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'contract-documents');

CREATE POLICY "Internal users can delete contract documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'contract-documents'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'staff')
  )
);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Default system settings
INSERT INTO public.system_settings (key, value) VALUES
  ('show_demo_data', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Default portal settings
INSERT INTO public.portal_settings (organization_name, website_url, description)
SELECT 
  'NextMove AI',
  'https://nextmove-ai.com',
  'AI-powered customer portal for streamlined service management'
WHERE NOT EXISTS (SELECT 1 FROM public.portal_settings);

-- Contract types
INSERT INTO public.contract_types (value, label, description, sort_order, tracks_hours, has_hour_limit, is_recurring, supports_rollover) VALUES
  ('hours_bucket', 'Hours Bucket', 'Fixed pool of hours to be used within a timeframe', 1, true, true, false, false),
  ('hours_subscription', 'Hours Subscription', 'Recurring hours that refresh monthly', 2, true, true, true, true),
  ('fixed_cost', 'Fixed Cost', 'Fixed price contract with hours tracked for visibility', 3, true, false, false, false),
  ('service_subscription', 'Service Subscription', 'Ongoing service at fixed cost with hours tracked', 4, true, false, true, false),
  ('on_demand', 'On-Demand / Ad-Hoc', 'Billed as used with no set parameters', 5, true, false, false, false)
ON CONFLICT (value) DO NOTHING;

-- Contract Statuses
INSERT INTO public.reference_values (type, value, label, sort_order, is_default) VALUES
  ('contract_status', 'draft', 'Draft', 1, true),
  ('contract_status', 'active', 'Active', 2, false),
  ('contract_status', 'expired', 'Expired', 3, false),
  ('contract_status', 'closed', 'Closed', 4, false),
  ('contract_status', 'archived', 'Archived', 5, false)
ON CONFLICT (type, value) DO NOTHING;

-- Time Categories
INSERT INTO public.reference_values (type, value, label, sort_order, is_default) VALUES
  ('time_category', 'administrative', 'Administrative', 1, false),
  ('time_category', 'research', 'Research', 2, false),
  ('time_category', 'technical', 'Technical', 3, true),
  ('time_category', 'meetings', 'Meetings / Presentations', 4, false)
ON CONFLICT (type, value) DO NOTHING;

-- Priority Statuses
INSERT INTO public.reference_values (type, value, label, sort_order, is_default) VALUES
  ('priority_status', 'backlog', 'Backlog', 1, true),
  ('priority_status', 'next_up', 'Next Up', 2, false),
  ('priority_status', 'active', 'Active', 3, false),
  ('priority_status', 'complete', 'Complete', 4, false),
  ('priority_status', 'on_hold', 'On Hold', 5, false)
ON CONFLICT (type, value) DO NOTHING;

-- Priority Levels
INSERT INTO public.reference_values (type, value, label, sort_order, is_default) VALUES
  ('priority_level', 'high', 'High', 1, false),
  ('priority_level', 'medium', 'Medium', 2, true),
  ('priority_level', 'low', 'Low', 3, false)
ON CONFLICT (type, value) DO NOTHING;

-- Request Statuses
INSERT INTO public.reference_values (type, value, label, sort_order, is_default) VALUES
  ('request_status', 'new', 'New', 1, true),
  ('request_status', 'in_review', 'In Review', 2, false),
  ('request_status', 'in_progress', 'In Progress', 3, false),
  ('request_status', 'closed', 'Closed', 4, false)
ON CONFLICT (type, value) DO NOTHING;
