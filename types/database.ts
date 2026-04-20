export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  name: string;
  status: CustomerStatus;
  primary_contact_id: string | null;
  secondary_contact_id: string | null;
  notes: string | null;
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
  created_at: string;
  updated_at: string;
}
