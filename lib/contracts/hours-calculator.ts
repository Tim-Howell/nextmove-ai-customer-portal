import { CONTRACT_TYPE_VALUES } from "@/lib/validations/contract";

export interface TimeEntryForCalculation {
  hours: number;
  entry_date: string;
}

export interface ContractForCalculation {
  id: string;
  contract_type_value: string;
  total_hours: number | null;
  hours_per_period: number | null;
  billing_day: number | null;
  start_date: string | null;
  end_date: string | null;
  rollover_enabled: boolean;
  rollover_expiration_days: number | null;
  max_rollover_hours: number | null;
}

export interface PeriodInfo {
  start: Date;
  end: Date;
  periodNumber: number;
}

export interface HoursCalculationResult {
  // Common fields
  totalHoursUsed: number;
  
  // Bucket-specific
  bucketHoursRemaining?: number;
  isBucketExceeded?: boolean;
  
  // Subscription-specific
  currentPeriod?: PeriodInfo;
  periodHoursUsed?: number;
  periodHoursRemaining?: number;
  rolloverHoursAvailable?: number;
  totalAvailableThisPeriod?: number;
  isOverLimit?: boolean;
}

/**
 * Calculate the billing period for a given date based on billing_day
 * Billing day is 1-28 to avoid month-end issues
 */
export function calculateBillingPeriod(
  billingDay: number,
  targetDate: Date = new Date()
): PeriodInfo {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const day = targetDate.getDate();
  
  let periodStart: Date;
  let periodEnd: Date;
  let periodNumber: number;
  
  if (day >= billingDay) {
    // We're in the period that started this month
    periodStart = new Date(year, month, billingDay);
    periodEnd = new Date(year, month + 1, billingDay - 1);
    periodNumber = year * 12 + month;
  } else {
    // We're in the period that started last month
    periodStart = new Date(year, month - 1, billingDay);
    periodEnd = new Date(year, month, billingDay - 1);
    periodNumber = year * 12 + month - 1;
  }
  
  // Set end to end of day
  periodEnd.setHours(23, 59, 59, 999);
  
  return { start: periodStart, end: periodEnd, periodNumber };
}

/**
 * Get all billing periods from contract start to target date
 */
export function getAllBillingPeriods(
  billingDay: number,
  contractStartDate: Date,
  targetDate: Date = new Date()
): PeriodInfo[] {
  const periods: PeriodInfo[] = [];
  let currentPeriod = calculateBillingPeriod(billingDay, contractStartDate);
  
  // Adjust if contract started after the billing day
  if (contractStartDate > currentPeriod.start) {
    currentPeriod = calculateBillingPeriod(billingDay, new Date(
      contractStartDate.getFullYear(),
      contractStartDate.getMonth() + 1,
      billingDay
    ));
  }
  
  const targetPeriod = calculateBillingPeriod(billingDay, targetDate);
  
  while (currentPeriod.periodNumber <= targetPeriod.periodNumber) {
    periods.push(currentPeriod);
    // Move to next period
    const nextMonth = new Date(currentPeriod.start);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    currentPeriod = calculateBillingPeriod(billingDay, nextMonth);
  }
  
  return periods;
}

/**
 * Calculate hours for a Hours Bucket contract
 */
export function calculateBucketHours(
  contract: ContractForCalculation,
  timeEntries: TimeEntryForCalculation[]
): HoursCalculationResult {
  const totalHoursUsed = timeEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);
  const totalHours = contract.total_hours || 0;
  const bucketHoursRemaining = totalHours - totalHoursUsed;
  
  return {
    totalHoursUsed,
    bucketHoursRemaining,
    isBucketExceeded: bucketHoursRemaining < 0,
  };
}

/**
 * Calculate hours for a Hours Subscription contract with rollover support
 */
export function calculateSubscriptionHours(
  contract: ContractForCalculation,
  timeEntries: TimeEntryForCalculation[],
  targetDate: Date = new Date()
): HoursCalculationResult {
  const billingDay = contract.billing_day || 1;
  const hoursPerPeriod = contract.hours_per_period || 0;
  const contractStartDate = contract.start_date ? new Date(contract.start_date) : new Date();
  
  // Get current period
  const currentPeriod = calculateBillingPeriod(billingDay, targetDate);
  
  // Calculate total hours used (all time)
  const totalHoursUsed = timeEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);
  
  // Calculate hours used in current period
  const periodEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.entry_date);
    return entryDate >= currentPeriod.start && entryDate <= currentPeriod.end;
  });
  const periodHoursUsed = periodEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);
  
  // Calculate rollover if enabled
  let rolloverHoursAvailable = 0;
  
  if (contract.rollover_enabled) {
    // Get all periods from contract start to current
    const allPeriods = getAllBillingPeriods(billingDay, contractStartDate, targetDate);
    
    // Calculate rollover from each previous period
    for (let i = 0; i < allPeriods.length - 1; i++) {
      const period = allPeriods[i];
      if (!period) continue;
      
      // Hours used in this period
      const periodUsed = timeEntries
        .filter(entry => {
          const entryDate = new Date(entry.entry_date);
          return entryDate >= period.start && entryDate <= period.end;
        })
        .reduce((sum, entry) => sum + Number(entry.hours), 0);
      
      // Unused hours from this period
      const unusedHours = Math.max(0, hoursPerPeriod - periodUsed);
      
      // Check if rollover has expired
      if (contract.rollover_expiration_days) {
        const expirationDate = new Date(period.end);
        expirationDate.setDate(expirationDate.getDate() + contract.rollover_expiration_days);
        
        if (targetDate > expirationDate) {
          // Rollover has expired, don't add it
          continue;
        }
      } else if (contract.end_date) {
        // Rollover expires at end of contract
        const contractEnd = new Date(contract.end_date);
        if (targetDate > contractEnd) {
          continue;
        }
      }
      
      rolloverHoursAvailable += unusedHours;
    }
    
    // Apply max rollover cap if set
    if (contract.max_rollover_hours && rolloverHoursAvailable > contract.max_rollover_hours) {
      rolloverHoursAvailable = contract.max_rollover_hours;
    }
  }
  
  // Total available this period = period allocation + rollover
  const totalAvailableThisPeriod = hoursPerPeriod + rolloverHoursAvailable;
  
  // Hours remaining = total available - period used
  // Note: Rollover is used FIRST, so we track it separately
  const periodHoursRemaining = totalAvailableThisPeriod - periodHoursUsed;
  
  return {
    totalHoursUsed,
    currentPeriod,
    periodHoursUsed,
    periodHoursRemaining,
    rolloverHoursAvailable,
    totalAvailableThisPeriod,
    isOverLimit: periodHoursRemaining < 0,
  };
}

/**
 * Calculate hours for any contract type
 */
export function calculateContractHours(
  contract: ContractForCalculation,
  timeEntries: TimeEntryForCalculation[],
  targetDate: Date = new Date()
): HoursCalculationResult {
  const totalHoursUsed = timeEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);
  
  switch (contract.contract_type_value) {
    case CONTRACT_TYPE_VALUES.HOURS_BUCKET:
      return calculateBucketHours(contract, timeEntries);
      
    case CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION:
      return calculateSubscriptionHours(contract, timeEntries, targetDate);
      
    case CONTRACT_TYPE_VALUES.FIXED_COST:
    case CONTRACT_TYPE_VALUES.SERVICE_SUBSCRIPTION:
    case CONTRACT_TYPE_VALUES.ON_DEMAND:
    default:
      // Just track total hours, no limits
      return { totalHoursUsed };
  }
}

/**
 * Format hours remaining for display
 */
export function formatHoursRemaining(result: HoursCalculationResult, contractTypeValue: string): string {
  switch (contractTypeValue) {
    case CONTRACT_TYPE_VALUES.HOURS_BUCKET:
      if (result.isBucketExceeded) {
        return `${Math.abs(result.bucketHoursRemaining || 0).toFixed(1)} hours over limit`;
      }
      return `${(result.bucketHoursRemaining || 0).toFixed(1)} hours remaining`;
      
    case CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION:
      if (result.isOverLimit) {
        return `${Math.abs(result.periodHoursRemaining || 0).toFixed(1)} hours over this period`;
      }
      const rolloverNote = result.rolloverHoursAvailable 
        ? ` (incl. ${result.rolloverHoursAvailable.toFixed(1)} rollover)` 
        : "";
      return `${(result.periodHoursRemaining || 0).toFixed(1)} hours remaining this period${rolloverNote}`;
      
    default:
      return `${result.totalHoursUsed.toFixed(1)} hours logged`;
  }
}
