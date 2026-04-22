import { z } from "zod";

export const contractSchema = z.object({
  customer_id: z.string().uuid({ message: "Customer is required" }),
  name: z.string().min(1, { message: "Contract name is required" }),
  contract_type_id: z.string().uuid({ message: "Contract type is required" }),
  status_id: z.string().uuid({ message: "Contract status is required" }),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  total_hours: z.coerce.number().positive().nullable().optional(),
  description: z.string().nullable().optional(),
  // Billing fields
  billing_day: z.coerce.number().min(1).max(28).nullable().optional(),
  hours_per_period: z.coerce.number().positive().nullable().optional(),
  rollover_enabled: z.boolean().default(false),
  rollover_expiration_days: z.coerce.number().positive().nullable().optional(),
  max_rollover_hours: z.coerce.number().positive().nullable().optional(),
  fixed_cost: z.coerce.number().positive().nullable().optional(),
});

export type ContractFormData = z.infer<typeof contractSchema>;

export const CONTRACT_TYPE_VALUES = {
  HOURS_BUCKET: "hours_bucket",
  HOURS_SUBSCRIPTION: "hours_subscription",
  FIXED_COST: "fixed_cost",
  SERVICE_SUBSCRIPTION: "service_subscription",
  ON_DEMAND: "on_demand",
} as const;

export type ContractTypeValue = typeof CONTRACT_TYPE_VALUES[keyof typeof CONTRACT_TYPE_VALUES];

export const CONTRACT_STATUS_VALUES = {
  DRAFT: "draft",
  ACTIVE: "active",
  EXPIRED: "expired",
  CLOSED: "closed",
  ARCHIVED: "archived",
} as const;

export function isHourBasedContract(contractTypeValue: string): boolean {
  return (
    contractTypeValue === CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION ||
    contractTypeValue === CONTRACT_TYPE_VALUES.HOURS_BUCKET
  );
}

export function hasHourLimit(contractTypeValue: string): boolean {
  return (
    contractTypeValue === CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION ||
    contractTypeValue === CONTRACT_TYPE_VALUES.HOURS_BUCKET
  );
}

export function isRecurringContract(contractTypeValue: string): boolean {
  return (
    contractTypeValue === CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION ||
    contractTypeValue === CONTRACT_TYPE_VALUES.SERVICE_SUBSCRIPTION
  );
}

export function supportsRollover(contractTypeValue: string): boolean {
  return contractTypeValue === CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION;
}
