-- Fix audit trigger to handle tables without archived_at column
-- This fixes the error: record "new" has no field "archived_at"

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
  -- Get user context from session variables (set by application)
  audit_user_id := NULLIF(current_setting('app.current_user_id', true), '')::UUID;
  audit_user_email := NULLIF(current_setting('app.current_user_email', true), '');
  audit_user_role := NULLIF(current_setting('app.current_user_role', true), '');

  -- Check if table has archived_at column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = TG_TABLE_SCHEMA 
    AND table_name = TG_TABLE_NAME 
    AND column_name = 'archived_at'
  ) INTO has_archived_at;

  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'create';
    new_data := to_jsonb(NEW);
    old_data := NULL;
    changed_cols := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    
    -- Check for archive/restore actions only if table has archived_at
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
    COALESCE((new_data->>'id')::UUID, (old_data->>'id')::UUID),
    action_type,
    audit_user_id,
    audit_user_email,
    audit_user_role,
    old_data,
    new_data,
    changed_cols
  );

  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.audit_trigger_func() IS 'Generic audit trigger function that logs changes to audit_logs table. Handles tables with or without archived_at column.';
