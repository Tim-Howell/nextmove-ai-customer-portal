export const ERROR_CODES = {
  // Customer Errors (CUS-XXX-XXX)
  CUS_CRE_001: "CUS-CRE-001", // Customer name already exists
  CUS_CRE_002: "CUS-CRE-002", // Invalid customer data
  CUS_UPD_001: "CUS-UPD-001", // Customer not found
  CUS_UPD_002: "CUS-UPD-002", // Invalid update data
  CUS_DEL_001: "CUS-DEL-001", // Cannot delete customer with active contracts
  CUS_DEL_002: "CUS-DEL-002", // Customer not found
  CUS_ARC_001: "CUS-ARC-001", // Customer already archived
  CUS_ARC_002: "CUS-ARC-002", // Cannot archive customer
  CUS_GET_001: "CUS-GET-001", // Customer not found

  // Contact Errors (CON-XXX-XXX) - using CON for contacts
  CNT_CRE_001: "CNT-CRE-001", // Invalid contact data
  CNT_CRE_002: "CNT-CRE-002", // Customer not found
  CNT_UPD_001: "CNT-UPD-001", // Contact not found
  CNT_DEL_001: "CNT-DEL-001", // Cannot delete contact

  // Contract Errors (CTR-XXX-XXX)
  CTR_CRE_001: "CTR-CRE-001", // Invalid contract dates
  CTR_CRE_002: "CTR-CRE-002", // Customer not found
  CTR_CRE_003: "CTR-CRE-003", // Invalid contract data
  CTR_UPD_001: "CTR-UPD-001", // Contract not found
  CTR_UPD_002: "CTR-UPD-002", // Invalid update data
  CTR_DEL_001: "CTR-DEL-001", // Cannot delete contract with time entries
  CTR_DEL_002: "CTR-DEL-002", // Contract not found
  CTR_ARC_001: "CTR-ARC-001", // Contract already archived
  CTR_ARC_002: "CTR-ARC-002", // Archived status not found
  CTR_VAL_001: "CTR-VAL-001", // Hours per period required for subscription

  // Time Entry Errors (TIM-XXX-XXX)
  TIM_CRE_001: "TIM-CRE-001", // Invalid time entry data
  TIM_CRE_002: "TIM-CRE-002", // Contract is archived
  TIM_CRE_003: "TIM-CRE-003", // Customer is archived
  TIM_UPD_001: "TIM-UPD-001", // Time entry not found
  TIM_UPD_002: "TIM-UPD-002", // Invalid update data
  TIM_DEL_001: "TIM-DEL-001", // Cannot delete time entry
  TIM_DEL_002: "TIM-DEL-002", // Time entry not found

  // Priority Errors (PRI-XXX-XXX)
  PRI_CRE_001: "PRI-CRE-001", // Invalid priority data
  PRI_CRE_002: "PRI-CRE-002", // Customer is archived
  PRI_UPD_001: "PRI-UPD-001", // Priority not found
  PRI_UPD_002: "PRI-UPD-002", // Priority is read-only
  PRI_DEL_001: "PRI-DEL-001", // Cannot delete priority

  // Request Errors (REQ-XXX-XXX)
  REQ_CRE_001: "REQ-CRE-001", // Invalid request data
  REQ_CRE_002: "REQ-CRE-002", // Customer is archived
  REQ_UPD_001: "REQ-UPD-001", // Request not found
  REQ_UPD_002: "REQ-UPD-002", // Request is read-only
  REQ_DEL_001: "REQ-DEL-001", // Cannot delete request

  // User/Profile Errors (USR-XXX-XXX)
  USR_CRE_001: "USR-CRE-001", // Email already exists
  USR_CRE_002: "USR-CRE-002", // Invalid user data
  USR_UPD_001: "USR-UPD-001", // User not found
  USR_UPD_002: "USR-UPD-002", // Invalid update data
  USR_DEL_001: "USR-DEL-001", // Cannot delete user
  USR_INV_001: "USR-INV-001", // Failed to send invitation

  // Authentication Errors (AUT-XXX-XXX)
  AUT_LOG_001: "AUT-LOG-001", // Invalid credentials
  AUT_LOG_002: "AUT-LOG-002", // Account disabled
  AUT_LOG_003: "AUT-LOG-003", // Customer archived
  AUT_LOG_004: "AUT-LOG-004", // Portal access disabled
  AUT_SES_001: "AUT-SES-001", // Session expired
  AUT_SES_002: "AUT-SES-002", // Not authenticated
  AUT_PER_001: "AUT-PER-001", // Not authorized

  // System Errors (SYS-XXX-XXX)
  SYS_DB_001: "SYS-DB-001", // Database connection error
  SYS_DB_002: "SYS-DB-002", // Query timeout
  SYS_VAL_001: "SYS-VAL-001", // Validation failed
  SYS_PER_001: "SYS-PER-001", // Permission denied
  SYS_UNK_001: "SYS-UNK-001", // Unknown error
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
