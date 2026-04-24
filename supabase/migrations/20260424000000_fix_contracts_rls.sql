-- Fix contracts RLS to restrict customer_user access to their own customer's contracts

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Contracts are viewable by authenticated users" ON public.contracts;

-- Create new policy that restricts customer_users to their own customer's contracts
CREATE POLICY "Contracts are viewable by authorized users"
  ON public.contracts FOR SELECT
  TO authenticated
  USING (
    -- Internal users (admin/staff) can see all contracts
    public.get_user_role(auth.uid()) IN ('admin', 'staff')
    OR
    -- Customer users can only see their own customer's contracts
    (
      public.get_user_role(auth.uid()) = 'customer_user'
      AND customer_id = (SELECT customer_id FROM public.profiles WHERE id = auth.uid())
    )
  );
