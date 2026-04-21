export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  name: string;
  status: CustomerStatus;
  primary_contact_id: string | null;
  secondary_contact_id: string | null;
  notes: string | null;
  internal_notes: string | null;
  is_demo: boolean;
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
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractWithRelations extends Contract {
  customer?: {
    id: string;
    name: string;
  };
  contract_type?: ReferenceValue;
  status?: ReferenceValue;
  hours_used?: number;
  hours_remaining?: number | null;
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
  category?: ReferenceValue;
}

// Priority types
export interface Priority {
  id: string;
  customer_id: string;
  title: string;
  description: string | null;
  internal_notes: string | null;
  status_id: string;
  priority_level_id: string;
  due_date: string | null;
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

