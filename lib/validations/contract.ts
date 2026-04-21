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
});

export type ContractFormData = z.infer<typeof contractSchema>;

export const CONTRACT_TYPE_VALUES = {
  HOURS_SUBSCRIPTION: "hours_subscription",
  HOURS_BUCKET: "hours_bucket",
  FIXED_COST: "fixed_cost",
  SERVICE_SUBSCRIPTION: "service_subscription",
} as const;

export const CONTRACT_STATUS_VALUES = {
  DRAFT: "draft",
  ACTIVE: "active",
  EXPIRED: "expired",
  CLOSED: "closed",
} as const;

export function isHourBasedContract(contractTypeValue: string): boolean {
  return (
    contractTypeValue === CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION ||
    contractTypeValue === CONTRACT_TYPE_VALUES.HOURS_BUCKET
  );
}
