-- Migration: Add is_default column to contracts table
-- This allows marking a contract as the default/base contract for a customer

ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.contracts.is_default IS 'Marks this as the default base contract for ad-hoc/on-demand work';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contracts_is_default ON public.contracts(customer_id, is_default) WHERE is_default = true;
