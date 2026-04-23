-- Migration: UI and Field Improvements
-- Adds website field to customers, icon field to priorities, and contact role designations

-- 1. Add website column to customers table
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS website TEXT;

-- 2. Add icon column to priorities table (stores Lucide icon name)
ALTER TABLE public.priorities
ADD COLUMN IF NOT EXISTS icon TEXT;

-- 3. Add contact role designation columns to customers table
-- These are foreign keys to customer_contacts for billing and POC roles
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS billing_contact_primary_id UUID REFERENCES public.customer_contacts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS billing_contact_secondary_id UUID REFERENCES public.customer_contacts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS poc_primary_id UUID REFERENCES public.customer_contacts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS poc_secondary_id UUID REFERENCES public.customer_contacts(id) ON DELETE SET NULL;

-- Create indexes for the foreign keys
CREATE INDEX IF NOT EXISTS idx_customers_billing_contact_primary ON public.customers(billing_contact_primary_id);
CREATE INDEX IF NOT EXISTS idx_customers_billing_contact_secondary ON public.customers(billing_contact_secondary_id);
CREATE INDEX IF NOT EXISTS idx_customers_poc_primary ON public.customers(poc_primary_id);
CREATE INDEX IF NOT EXISTS idx_customers_poc_secondary ON public.customers(poc_secondary_id);

-- Add comment for documentation
COMMENT ON COLUMN public.customers.website IS 'Customer website URL (stored lowercase)';
COMMENT ON COLUMN public.priorities.icon IS 'Lucide icon name for visual identification';
COMMENT ON COLUMN public.customers.billing_contact_primary_id IS 'Primary billing contact for invoices';
COMMENT ON COLUMN public.customers.billing_contact_secondary_id IS 'Secondary billing contact';
COMMENT ON COLUMN public.customers.poc_primary_id IS 'Primary point of contact for work';
COMMENT ON COLUMN public.customers.poc_secondary_id IS 'Secondary point of contact';
