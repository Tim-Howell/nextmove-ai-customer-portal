-- Phase 16: Archive Capabilities
-- Add archive fields to customers, contracts, and customer_contacts
-- Add read-only flags to priorities and requests

-- 1. Add archived_at to customers table
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Add archived_at to contracts table
ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL;

-- 3. Add archived_at and is_archived to customer_contacts table
ALTER TABLE public.customer_contacts
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- 4. Add is_read_only to priorities table
ALTER TABLE public.priorities
ADD COLUMN IF NOT EXISTS is_read_only BOOLEAN DEFAULT FALSE;

-- 5. Add is_read_only to requests table
ALTER TABLE public.requests
ADD COLUMN IF NOT EXISTS is_read_only BOOLEAN DEFAULT FALSE;

-- 6. Create indexes for archive queries
CREATE INDEX IF NOT EXISTS idx_customers_archived_at ON public.customers(archived_at);
CREATE INDEX IF NOT EXISTS idx_contracts_archived_at ON public.contracts(archived_at);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_archived_at ON public.customer_contacts(archived_at);
CREATE INDEX IF NOT EXISTS idx_priorities_is_read_only ON public.priorities(is_read_only);
CREATE INDEX IF NOT EXISTS idx_requests_is_read_only ON public.requests(is_read_only);

-- 7. Migrate existing archived customers (status = 'archived') to use archived_at
UPDATE public.customers
SET archived_at = updated_at
WHERE status = 'archived' AND archived_at IS NULL;

-- 8. Add comments for documentation
COMMENT ON COLUMN public.customers.archived_at IS 'Timestamp when customer was archived. NULL means active.';
COMMENT ON COLUMN public.contracts.archived_at IS 'Timestamp when contract was archived. NULL means active.';
COMMENT ON COLUMN public.customer_contacts.archived_at IS 'Timestamp when contact was archived. NULL means active.';
COMMENT ON COLUMN public.customer_contacts.is_archived IS 'Whether contact is archived (redundant with archived_at for quick filtering).';
COMMENT ON COLUMN public.priorities.is_read_only IS 'Whether priority is read-only (e.g., customer archived).';
COMMENT ON COLUMN public.requests.is_read_only IS 'Whether request is read-only (e.g., customer archived).';
