export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  name: string;
  status: CustomerStatus;
  primary_contact_id: string | null;
  secondary_contact_id: string | null;
  notes: string | null;
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
