export type CustomerStatus = "active" | "inactive" | "archived";

export interface Customer {
  id: string;
  name: string;
  status: CustomerStatus;
  primary_contact_id: string | null;
  secondary_contact_id: string | null;
  notes: string | null;
  internal_notes: string | null;
  logo_url: string | null;
  website: string | null;
  billing_contact_primary_id: string | null;
  billing_contact_secondary_id: string | null;
  poc_primary_id: string | null;
  poc_secondary_id: string | null;
  is_demo: boolean;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerWithContacts extends Customer {
  primary_contact?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
  secondary_contact?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
  billing_contact_primary?: {
    id: string;
    full_name: string;
    email: string | null;
  } | null;
  billing_contact_secondary?: {
    id: string;
    full_name: string;
    email: string | null;
  } | null;
  poc_primary?: {
    id: string;
    full_name: string;
    email: string | null;
  } | null;
  poc_secondary?: {
    id: string;
    full_name: string;
    email: string | null;
  } | null;
}

export interface CustomerContact {
  id: string;
  customer_id: string;
  full_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  portal_access_enabled: boolean;
  notes: string | null;
  is_demo: boolean;
  user_id: string | null;
  is_archived: boolean;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ReferenceValueType =
  | "contract_type"
  | "contract_status"
  | "time_category"
  | "priority_status"
  | "priority_level"
  | "request_status";

export interface ReferenceValue {
  id: string;
  type: ReferenceValueType;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  is_default: boolean;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  key: string;
  value: unknown;
  updated_at: string;
}

export interface CustomerInvitation {
  id: string;
  contact_id: string;
  email: string;
  invited_by: string;
  invited_at: string;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
}

export type InvitationStatus = "not_invited" | "pending" | "expired" | "active";

export interface CustomerContactWithInvitation extends CustomerContact {
  user_id: string | null;
  invitation?: CustomerInvitation | null;
  invitation_status: InvitationStatus;
}

// Contract Type definition
export interface ContractType {
  id: string;
  value: string;
  label: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  tracks_hours: boolean;
  has_hour_limit: boolean;
  is_recurring: boolean;
  supports_rollover: boolean;
  created_at: string;
  updated_at: string;
}

// Contract types
export interface Contract {
  id: string;
  customer_id: string;
  name: string;
  contract_type_id: string;
  status_id: string;
  start_date: string | null;
  end_date: string | null;
  total_hours: number | null;
  description: string | null;
  is_default: boolean;
  created_by: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  // Billing fields
  billing_day: number | null;
  hours_per_period: number | null;
  rollover_enabled: boolean;
  rollover_expiration_days: number | null;
  max_rollover_hours: number | null;
  fixed_cost: number | null;
}

export interface ContractWithRelations extends Contract {
  customer?: {
    id: string;
    name: string;
  };
  contract_type?: ContractType;
  status?: ReferenceValue;
  // Calculated fields
  hours_used?: number;
  hours_remaining?: number | null;
  // Subscription-specific calculated fields
  current_period_start?: string;
  current_period_end?: string;
  period_hours_used?: number;
  period_hours_remaining?: number | null;
  rollover_hours_available?: number;
  is_over_limit?: boolean;
}

export interface ContractDocument {
  id: string;
  contract_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  content_type: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface ContractDocumentWithUploader extends ContractDocument {
  uploader?: {
    id: string;
    full_name: string | null;
  };
}

// Time entry types
export interface TimeEntry {
  id: string;
  customer_id: string;
  contract_id: string | null;
  staff_id: string;
  entered_by: string | null;
  entry_date: string;
  hours: number;
  category_id: string;
  description: string | null;
  is_billable: boolean;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimeEntryWithRelations extends TimeEntry {
  customer?: {
    id: string;
    name: string;
  };
  contract?: {
    id: string;
    name: string;
  } | null;
  staff?: {
    id: string;
    full_name: string | null;
  };
  entered_by_profile?: {
    id: string;
    full_name: string | null;
  } | null;
  category?: ReferenceValue;
}

// Priority types
export interface Priority {
  id: string;
  customer_id: string;
  title: string;
  description: string | null;
  internal_notes: string | null;
  image_url: string | null;
  icon: string | null;
  status_id: string;
  priority_level_id: string;
  due_date: string | null;
  is_read_only: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PriorityWithRelations extends Priority {
  customer?: {
    id: string;
    name: string;
  };
  status?: ReferenceValue;
  priority_level?: ReferenceValue;
  creator?: {
    id: string;
    full_name: string | null;
  };
}

// Request types
export interface Request {
  id: string;
  customer_id: string;
  submitted_by: string | null;
  title: string;
  description: string | null;
  status_id: string;
  internal_notes: string | null;
  is_read_only: boolean;
  created_at: string;
  updated_at: string;
}

export interface RequestWithRelations extends Request {
  customer?: {
    id: string;
    name: string;
  };
  status?: ReferenceValue;
  submitter?: {
    id: string;
    full_name: string | null;
  };
}

// Audit Log types
export type AuditAction = "create" | "update" | "delete" | "archive" | "restore";

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: AuditAction;
  user_id: string | null;
  user_email: string | null;
  user_role: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  changed_fields: string[] | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditLogWithUser extends AuditLog {
  user?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
}

// Internal Notes
export type InternalNoteEntityType = 'customer' | 'priority' | 'request';

export interface InternalNote {
  id: string;
  entity_type: InternalNoteEntityType;
  entity_id: string;
  note_text: string;
  created_by: string;
  created_at: string;
}

export interface InternalNoteWithAuthor extends InternalNote {
  author: {
    id: string;
    full_name: string | null;
    email: string;
  };
}
