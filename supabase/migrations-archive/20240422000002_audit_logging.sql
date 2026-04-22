-- Phase 18: Audit Logging
-- Create audit_logs table and triggers for tracking all changes

-- 1. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What changed
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'archive', 'restore')),
  
  -- Who changed it
  user_id UUID REFERENCES public.profiles(id),
  user_email TEXT,
  user_role TEXT,
  
  -- Change details
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);

-- 3. Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Admin read-only access
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 5. Create audit trigger function
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
BEGIN
  -- Get user context from session variables (set by application)
  audit_user_id := NULLIF(current_setting('app.current_user_id', true), '')::UUID;
  audit_user_email := NULLIF(current_setting('app.current_user_email', true), '');
  audit_user_role := NULLIF(current_setting('app.current_user_role', true), '');

  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'create';
    new_data := to_jsonb(NEW);
    old_data := NULL;
    changed_cols := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check for archive/restore actions
    IF NEW.archived_at IS NOT NULL AND (OLD.archived_at IS NULL OR OLD.archived_at != NEW.archived_at) THEN
      action_type := 'archive';
    ELSIF NEW.archived_at IS NULL AND OLD.archived_at IS NOT NULL THEN
      action_type := 'restore';
    ELSE
      action_type := 'update';
    END IF;
    
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    
    -- Calculate changed fields
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

  -- Insert audit record
  INSERT INTO public.audit_logs (
    table_name,
    record_id,
    action,
    user_id,
    user_email,
    user_role,
    old_values,
    new_values,
    changed_fields
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    action_type,
    audit_user_id,
    audit_user_email,
    audit_user_role,
    old_data,
    new_data,
    changed_cols
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create triggers for each table

-- Customers
DROP TRIGGER IF EXISTS audit_customers ON public.customers;
CREATE TRIGGER audit_customers
  AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Customer Contacts
DROP TRIGGER IF EXISTS audit_customer_contacts ON public.customer_contacts;
CREATE TRIGGER audit_customer_contacts
  AFTER INSERT OR UPDATE OR DELETE ON public.customer_contacts
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Contracts
DROP TRIGGER IF EXISTS audit_contracts ON public.contracts;
CREATE TRIGGER audit_contracts
  AFTER INSERT OR UPDATE OR DELETE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Time Entries
DROP TRIGGER IF EXISTS audit_time_entries ON public.time_entries;
CREATE TRIGGER audit_time_entries
  AFTER INSERT OR UPDATE OR DELETE ON public.time_entries
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Priorities
DROP TRIGGER IF EXISTS audit_priorities ON public.priorities;
CREATE TRIGGER audit_priorities
  AFTER INSERT OR UPDATE OR DELETE ON public.priorities
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Requests
DROP TRIGGER IF EXISTS audit_requests ON public.requests;
CREATE TRIGGER audit_requests
  AFTER INSERT OR UPDATE OR DELETE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Profiles (for role/status changes)
DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
  AFTER UPDATE ON public.profiles
  FOR EACH ROW 
  WHEN (OLD.role IS DISTINCT FROM NEW.role OR OLD.is_active IS DISTINCT FROM NEW.is_active)
  EXECUTE FUNCTION public.audit_trigger_func();

-- Portal Settings
DROP TRIGGER IF EXISTS audit_portal_settings ON public.portal_settings;
CREATE TRIGGER audit_portal_settings
  AFTER INSERT OR UPDATE OR DELETE ON public.portal_settings
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Reference Values
DROP TRIGGER IF EXISTS audit_reference_values ON public.reference_values;
CREATE TRIGGER audit_reference_values
  AFTER INSERT OR UPDATE OR DELETE ON public.reference_values
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Contract Types
DROP TRIGGER IF EXISTS audit_contract_types ON public.contract_types;
CREATE TRIGGER audit_contract_types
  AFTER INSERT OR UPDATE OR DELETE ON public.contract_types
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- 7. Create RPC function to set audit context from application
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

-- 8. Add comments
COMMENT ON TABLE public.audit_logs IS 'Tracks all changes made to audited tables';
COMMENT ON COLUMN public.audit_logs.action IS 'Type of change: create, update, delete, archive, restore';
COMMENT ON COLUMN public.audit_logs.changed_fields IS 'List of field names that changed (for updates)';
