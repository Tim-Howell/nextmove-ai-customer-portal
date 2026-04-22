import { ERROR_CODES, type ErrorCode } from "./codes";

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Customer Errors
  [ERROR_CODES.CUS_CRE_001]: "A customer with this name already exists",
  [ERROR_CODES.CUS_CRE_002]: "Invalid customer information provided",
  [ERROR_CODES.CUS_UPD_001]: "Customer not found",
  [ERROR_CODES.CUS_UPD_002]: "Invalid customer update data",
  [ERROR_CODES.CUS_DEL_001]: "Cannot delete customer with active contracts",
  [ERROR_CODES.CUS_DEL_002]: "Customer not found",
  [ERROR_CODES.CUS_ARC_001]: "Customer is already archived",
  [ERROR_CODES.CUS_ARC_002]: "Failed to archive customer",
  [ERROR_CODES.CUS_GET_001]: "Customer not found",

  // Contact Errors
  [ERROR_CODES.CNT_CRE_001]: "Invalid contact information provided",
  [ERROR_CODES.CNT_CRE_002]: "Customer not found for this contact",
  [ERROR_CODES.CNT_UPD_001]: "Contact not found",
  [ERROR_CODES.CNT_DEL_001]: "Failed to delete contact",

  // Contract Errors
  [ERROR_CODES.CTR_CRE_001]: "Invalid contract dates - end date must be after start date",
  [ERROR_CODES.CTR_CRE_002]: "Customer not found for this contract",
  [ERROR_CODES.CTR_CRE_003]: "Invalid contract information provided",
  [ERROR_CODES.CTR_UPD_001]: "Contract not found",
  [ERROR_CODES.CTR_UPD_002]: "Invalid contract update data",
  [ERROR_CODES.CTR_DEL_001]: "Cannot delete contract with time entries",
  [ERROR_CODES.CTR_DEL_002]: "Contract not found",
  [ERROR_CODES.CTR_ARC_001]: "Contract is already archived",
  [ERROR_CODES.CTR_ARC_002]: "Archived status not configured in system",
  [ERROR_CODES.CTR_VAL_001]: "Hours per period is required for subscription contracts",

  // Time Entry Errors
  [ERROR_CODES.TIM_CRE_001]: "Invalid time entry information provided",
  [ERROR_CODES.TIM_CRE_002]: "Cannot add time entries to an archived contract",
  [ERROR_CODES.TIM_CRE_003]: "Cannot add time entries for an archived customer",
  [ERROR_CODES.TIM_UPD_001]: "Time entry not found",
  [ERROR_CODES.TIM_UPD_002]: "Invalid time entry update data",
  [ERROR_CODES.TIM_DEL_001]: "Failed to delete time entry",
  [ERROR_CODES.TIM_DEL_002]: "Time entry not found",

  // Priority Errors
  [ERROR_CODES.PRI_CRE_001]: "Invalid priority information provided",
  [ERROR_CODES.PRI_CRE_002]: "Cannot create priorities for an archived customer",
  [ERROR_CODES.PRI_UPD_001]: "Priority not found",
  [ERROR_CODES.PRI_UPD_002]: "This priority is read-only and cannot be edited",
  [ERROR_CODES.PRI_DEL_001]: "Failed to delete priority",

  // Request Errors
  [ERROR_CODES.REQ_CRE_001]: "Invalid request information provided",
  [ERROR_CODES.REQ_CRE_002]: "Cannot create requests for an archived customer",
  [ERROR_CODES.REQ_UPD_001]: "Request not found",
  [ERROR_CODES.REQ_UPD_002]: "This request is read-only and cannot be edited",
  [ERROR_CODES.REQ_DEL_001]: "Failed to delete request",

  // User/Profile Errors
  [ERROR_CODES.USR_CRE_001]: "A user with this email already exists",
  [ERROR_CODES.USR_CRE_002]: "Invalid user information provided",
  [ERROR_CODES.USR_UPD_001]: "User not found",
  [ERROR_CODES.USR_UPD_002]: "Invalid user update data",
  [ERROR_CODES.USR_DEL_001]: "Failed to delete user",
  [ERROR_CODES.USR_INV_001]: "Failed to send invitation email",

  // Authentication Errors
  [ERROR_CODES.AUT_LOG_001]: "Invalid email or password",
  [ERROR_CODES.AUT_LOG_002]: "Your account has been disabled",
  [ERROR_CODES.AUT_LOG_003]: "Your organization's account has been archived",
  [ERROR_CODES.AUT_LOG_004]: "Your portal access has been disabled",
  [ERROR_CODES.AUT_SES_001]: "Your session has expired. Please sign in again",
  [ERROR_CODES.AUT_SES_002]: "You must be signed in to perform this action",
  [ERROR_CODES.AUT_PER_001]: "You don't have permission to perform this action",

  // System Errors
  [ERROR_CODES.SYS_DB_001]: "Unable to connect to the database. Please try again",
  [ERROR_CODES.SYS_DB_002]: "The request took too long. Please try again",
  [ERROR_CODES.SYS_VAL_001]: "Please check your input and try again",
  [ERROR_CODES.SYS_PER_001]: "You don't have permission to perform this action",
  [ERROR_CODES.SYS_UNK_001]: "An unexpected error occurred. Please try again",
};

export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.SYS_UNK_001];
}
