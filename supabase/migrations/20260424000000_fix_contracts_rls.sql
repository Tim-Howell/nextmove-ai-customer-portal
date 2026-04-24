-- Fix RLS policies to restrict customer_user access to their own customer's data
-- Customer users should only see data for their own customer

-- ============================================================================
-- CUSTOMERS
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated can read customers" ON public.customers;

CREATE POLICY "Customers are viewable by authorized users"
  ON public.customers FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR
    (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ============================================================================
-- CONTRACTS
-- ============================================================================
DROP POLICY IF EXISTS "Contracts are viewable by authenticated users" ON public.contracts;

CREATE POLICY "Contracts are viewable by authorized users"
  ON public.contracts FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR
    (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND customer_id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ============================================================================
-- CONTRACT_DOCUMENTS
-- ============================================================================
DROP POLICY IF EXISTS "Contract documents are viewable by authenticated users" ON public.contract_documents;

CREATE POLICY "Contract documents are viewable by authorized users"
  ON public.contract_documents FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR
    (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND contract_id IN (
        SELECT id FROM public.contracts 
        WHERE customer_id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
      )
    )
  );

-- ============================================================================
-- TIME_ENTRIES
-- ============================================================================
DROP POLICY IF EXISTS "Time entries are viewable by authenticated users" ON public.time_entries;

CREATE POLICY "Time entries are viewable by authorized users"
  ON public.time_entries FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR
    (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND customer_id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ============================================================================
-- PRIORITIES
-- ============================================================================
DROP POLICY IF EXISTS "Priorities are viewable by authenticated users" ON public.priorities;

CREATE POLICY "Priorities are viewable by authorized users"
  ON public.priorities FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR
    (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND customer_id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ============================================================================
-- REQUESTS
-- ============================================================================
DROP POLICY IF EXISTS "Requests are viewable by authenticated users" ON public.requests;

CREATE POLICY "Requests are viewable by authorized users"
  ON public.requests FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR
    (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND customer_id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
    )
  );
