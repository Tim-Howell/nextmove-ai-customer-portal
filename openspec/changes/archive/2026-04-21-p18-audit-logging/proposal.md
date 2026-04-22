# Phase 18: Audit Logging & Error Handling

## Summary
Implement a comprehensive audit logging system to track all changes made in the portal, along with standardized error handling with error codes for common operations.

## Part 1: Audit Logging

### Goals
- Track all create, update, delete operations
- Record who made the change and when
- Store before/after values for updates
- Provide admin-only audit log viewer
- Support filtering and searching audit records

### Audit Log Schema
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What changed
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'archive', 'restore'
  
  -- Who changed it
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_role TEXT,
  
  -- Change details
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[], -- list of field names that changed
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

### Tables to Audit
- `customers` - all changes
- `customer_contacts` - all changes
- `contracts` - all changes
- `time_entries` - create, update, delete
- `priorities` - all changes
- `requests` - all changes
- `profiles` - role changes, status changes
- `portal_settings` - all changes
- `reference_values` - all changes

### Implementation Options

**Option A: Database Triggers (Recommended)**
- Create PostgreSQL triggers on each table
- Automatically captures all changes regardless of source
- Minimal application code changes
- Consistent and reliable

**Option B: Application-Level Logging**
- Add logging calls in each server action
- More control over what's logged
- Requires changes to every action
- Risk of missing changes

**Recommendation**: Use database triggers for reliability, with application-level enrichment for user context.

### Audit Log Viewer
- Admin-only page at `/settings/audit-log`
- Filterable by:
  - Table/entity type
  - Action type (create, update, delete)
  - User
  - Date range
  - Record ID
- Expandable rows to show before/after values
- Export to CSV option

## Part 2: Error Handling

### Goals
- Standardized error codes for all operations
- Consistent error response format
- User-friendly error messages
- Developer-friendly error details (in dev mode)
- Error tracking for debugging

### Error Code Structure
```
Format: [DOMAIN][OPERATION][NUMBER]
Example: CUS-CRE-001

Domains:
- CUS: Customer
- CON: Contract
- TIM: Time Entry
- PRI: Priority
- REQ: Request
- USR: User/Profile
- AUT: Authentication
- SYS: System

Operations:
- CRE: Create
- UPD: Update
- DEL: Delete
- GET: Fetch
- ARC: Archive
- VAL: Validation
```

### Common Error Codes

**Customer Errors (CUS-XXX-XXX)**
- CUS-CRE-001: Customer name already exists
- CUS-CRE-002: Invalid customer data
- CUS-UPD-001: Customer not found
- CUS-DEL-001: Cannot delete customer with active contracts
- CUS-ARC-001: Customer already archived

**Contract Errors (CON-XXX-XXX)**
- CON-CRE-001: Invalid contract dates
- CON-CRE-002: Customer not found
- CON-UPD-001: Contract not found
- CON-DEL-001: Cannot delete contract with time entries
- CON-VAL-001: Hours per period required for subscription

**Time Entry Errors (TIM-XXX-XXX)**
- TIM-CRE-001: Invalid time entry data
- TIM-CRE-002: Contract is archived
- TIM-CRE-003: Customer is archived
- TIM-UPD-001: Time entry not found
- TIM-DEL-001: Cannot delete time entry

**Authentication Errors (AUT-XXX-XXX)**
- AUT-LOG-001: Invalid credentials
- AUT-LOG-002: Account disabled
- AUT-LOG-003: Customer archived
- AUT-LOG-004: Portal access disabled
- AUT-SES-001: Session expired

**System Errors (SYS-XXX-XXX)**
- SYS-DB-001: Database connection error
- SYS-DB-002: Query timeout
- SYS-VAL-001: Validation failed
- SYS-PER-001: Permission denied

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;           // e.g., "CUS-CRE-001"
    message: string;        // User-friendly message
    details?: string;       // Developer details (dev only)
    field?: string;         // Field that caused error (for validation)
    timestamp: string;
  };
}
```

### Implementation
- Create error utility functions
- Update all server actions to use standardized errors
- Create error boundary components
- Add error logging for debugging
- Display user-friendly messages in UI
