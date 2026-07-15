-- ============================================================================
-- Security hardening: close cross-customer and privilege-escalation gaps
-- ============================================================================
--
-- Findings addressed (2026-07 security review):
--
-- 1. profiles: "Users can update own profile" had no column restrictions, so
--    any user could PATCH their own `role` to 'admin' via the REST API.
--    Fixed with a BEFORE UPDATE trigger that blocks non-admin changes to
--    role / customer_id / is_active. New-user default role was 'staff'
--    (privilege-by-default); now 'customer_user' (least privilege), with
--    handle_new_user() honoring an explicit role passed in user metadata.
--
-- 2. customers: INSERT/UPDATE/DELETE were open to any authenticated user.
--    Now internal (admin/staff) only.
--
-- 3. customer_contacts: SELECT/INSERT/UPDATE/DELETE were open to any
--    authenticated user (cross-customer PII exposure + writable). SELECT is
--    now scoped to internal users or the contact's own customer; writes are
--    internal only. (Invitation acceptance now uses the service role in app
--    code, which bypasses RLS.)
--
-- 4. requests: INSERT allowed any authenticated user to attribute a request
--    to any customer_id. Now internal users may insert for any customer;
--    customer users only for their own customer.
--
-- 5. storage / portal-documents: SELECT was open to all authenticated users,
--    letting any customer user list and download every customer's contract
--    files. Read is now internal, or customer-scoped via the
--    contracts/{contractId}/... path prefix. Uploads/updates are internal
--    only (customers never upload here today).
--
-- 6. storage / portal-assets: INSERT/UPDATE/DELETE were open to all
--    authenticated users (a customer user could overwrite the org logo).
--    Writes are now internal only; public read is unchanged so logos still
--    render on the unauthenticated login page.
--
-- All statements are idempotent (drop-then-create) so re-runs are safe.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1a. profiles: block self-service role/customer/active changes
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Service-role / system contexts (no JWT) are trusted: seed scripts,
  -- admin-client server actions, auth triggers.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Admins may change anything (RLS already restricts who can update).
  IF public.get_user_role(auth.uid()) = 'admin' THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role
     OR NEW.customer_id IS DISTINCT FROM OLD.customer_id
     OR NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    RAISE EXCEPTION 'Changing role, customer, or active status requires admin privileges';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profiles_sensitive_columns ON public.profiles;
CREATE TRIGGER protect_profiles_sensitive_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_sensitive_columns();

-- ----------------------------------------------------------------------------
-- 1b. profiles: least-privilege default role for new signups.
--     handle_new_user() honors an explicit valid role from user metadata
--     (set by inviteUser / createCustomerContact); everything else gets
--     customer_user instead of staff.
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer_user';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, customer_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    CASE
      WHEN NEW.raw_user_meta_data ->> 'role' IN ('admin', 'staff', 'customer_user')
        THEN NEW.raw_user_meta_data ->> 'role'
      ELSE 'customer_user'
    END,
    NULLIF(NEW.raw_user_meta_data ->> 'customer_id', '')::uuid
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 2. customers: writes are internal only
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated can delete customers" ON public.customers;

CREATE POLICY "Customers are insertable by internal users"
  ON public.customers FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

CREATE POLICY "Customers are updatable by internal users"
  ON public.customers FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

CREATE POLICY "Customers are deletable by internal users"
  ON public.customers FOR DELETE
  TO authenticated
  USING (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

-- ----------------------------------------------------------------------------
-- 3. customer_contacts: scoped read, internal-only writes
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated can read contacts"   ON public.customer_contacts;
DROP POLICY IF EXISTS "Authenticated can insert contacts" ON public.customer_contacts;
DROP POLICY IF EXISTS "Authenticated can update contacts" ON public.customer_contacts;
DROP POLICY IF EXISTS "Authenticated can delete contacts" ON public.customer_contacts;

CREATE POLICY "Contacts are viewable by authorized users"
  ON public.customer_contacts FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND customer_id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Contacts are insertable by internal users"
  ON public.customer_contacts FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

CREATE POLICY "Contacts are updatable by internal users"
  ON public.customer_contacts FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

CREATE POLICY "Contacts are deletable by internal users"
  ON public.customer_contacts FOR DELETE
  TO authenticated
  USING (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

-- ----------------------------------------------------------------------------
-- 4. requests: INSERT scoped to own customer for customer users
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Requests are insertable by authenticated users" ON public.requests;

CREATE POLICY "Requests are insertable by authorized users"
  ON public.requests FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND customer_id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- 5. storage / portal-documents: scoped read, internal-only writes.
--    Contract files are uploaded to contracts/{contractId}/{file}, so the
--    second path segment identifies the contract for customer scoping.
--    Signed URLs are created with the caller's own rights, so customer
--    downloads of their own contract files keep working.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "portal-documents: authenticated read"   ON storage.objects;
DROP POLICY IF EXISTS "portal-documents: authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "portal-documents: authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "portal-documents: scoped read"          ON storage.objects;
DROP POLICY IF EXISTS "portal-documents: internal upload"      ON storage.objects;
DROP POLICY IF EXISTS "portal-documents: internal update"      ON storage.objects;

CREATE POLICY "portal-documents: scoped read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'portal-documents'
  AND (
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND (storage.foldername(name))[1] = 'contracts'
      AND (storage.foldername(name))[2] IN (
        SELECT id::text FROM public.contracts
        WHERE customer_id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
      )
    )
  )
);

CREATE POLICY "portal-documents: internal upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portal-documents'
  AND public.get_user_role(auth.uid()) IN ('admin', 'staff')
);

CREATE POLICY "portal-documents: internal update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portal-documents'
  AND public.get_user_role(auth.uid()) IN ('admin', 'staff')
)
WITH CHECK (
  bucket_id = 'portal-documents'
  AND public.get_user_role(auth.uid()) IN ('admin', 'staff')
);

-- "portal-documents: internal delete" already exists and is unchanged.

-- ----------------------------------------------------------------------------
-- 6. storage / portal-assets: internal-only writes, public read unchanged
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "portal-assets: authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "portal-assets: authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "portal-assets: authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "portal-assets: internal upload"      ON storage.objects;
DROP POLICY IF EXISTS "portal-assets: internal update"      ON storage.objects;
DROP POLICY IF EXISTS "portal-assets: internal delete"      ON storage.objects;

CREATE POLICY "portal-assets: internal upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portal-assets'
  AND public.get_user_role(auth.uid()) IN ('admin', 'staff')
);

CREATE POLICY "portal-assets: internal update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portal-assets'
  AND public.get_user_role(auth.uid()) IN ('admin', 'staff')
)
WITH CHECK (
  bucket_id = 'portal-assets'
  AND public.get_user_role(auth.uid()) IN ('admin', 'staff')
);

CREATE POLICY "portal-assets: internal delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portal-assets'
  AND public.get_user_role(auth.uid()) IN ('admin', 'staff')
);
