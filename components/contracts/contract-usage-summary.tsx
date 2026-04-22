"use client";

import { Badge } from "@/components/ui/badge";
import type { ContractWithRelations } from "@/types/database";

interface ContractUsageSummaryProps {
  contract: ContractWithRelations;
  compact?: boolean;
}

function ProgressBar({ percent, variant }: { percent: number; variant: "default" | "warning" | "danger" }) {
  const bgColor = variant === "danger" ? "bg-destructive" : variant === "warning" ? "bg-amber-500" : "bg-primary";
  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div className={`h-full ${bgColor} transition-all`} style={{ width: `${Math.min(percent, 100)}%` }} />
    </div>
  );
}

export function ContractUsageSummary({ contract, compact = false }: ContractUsageSummaryProps) {
  const contractType = contract.contract_type?.value;
  
  // Hours Subscription - show period usage
  if (contractType === "hours_subscription") {
    const hoursPerPeriod = contract.hours_per_period || 0;
    const periodHoursUsed = contract.period_hours_used || 0;
    const remaining = hoursPerPeriod - periodHoursUsed;
    const percentUsed = hoursPerPeriod > 0 ? (periodHoursUsed / hoursPerPeriod) * 100 : 0;
    const isOverLimit = remaining < 0;
    const isNearLimit = percentUsed >= 80 && !isOverLimit;
    const variant = isOverLimit ? "danger" : isNearLimit ? "warning" : "default";

    if (compact) {
      return (
        <div className="space-y-1 min-w-[120px]">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {periodHoursUsed.toFixed(1)} / {hoursPerPeriod} hrs
            </span>
            {isOverLimit && <Badge variant="destructive" className="text-xs">Over</Badge>}
            {isNearLimit && <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">Near</Badge>}
          </div>
          <ProgressBar percent={percentUsed} variant={variant} />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Period Usage</span>
          <span className="font-medium">{periodHoursUsed.toFixed(1)} / {hoursPerPeriod} hrs</span>
        </div>
        <ProgressBar percent={percentUsed} variant={variant} />
        <div className="text-xs text-muted-foreground">
          {remaining >= 0 ? `${remaining.toFixed(1)} hrs remaining` : `${Math.abs(remaining).toFixed(1)} hrs over`}
        </div>
      </div>
    );
  }

  // Hours Bucket - show total usage
  if (contractType === "hours_bucket") {
    const totalHours = contract.total_hours || 0;
    const hoursUsed = contract.hours_used || 0;
    const remaining = totalHours - hoursUsed;
    const percentUsed = totalHours > 0 ? (hoursUsed / totalHours) * 100 : 0;
    const isOverLimit = remaining < 0;
    const isNearLimit = percentUsed >= 80 && !isOverLimit;
    const variant = isOverLimit ? "danger" : isNearLimit ? "warning" : "default";

    if (compact) {
      return (
        <div className="space-y-1 min-w-[120px]">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {hoursUsed.toFixed(1)} / {totalHours} hrs
            </span>
            {isOverLimit && <Badge variant="destructive" className="text-xs">Over</Badge>}
            {isNearLimit && <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">Near</Badge>}
          </div>
          <ProgressBar percent={percentUsed} variant={variant} />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Total Usage</span>
          <span className="font-medium">{hoursUsed.toFixed(1)} / {totalHours} hrs</span>
        </div>
        <ProgressBar percent={percentUsed} variant={variant} />
        <div className="text-xs text-muted-foreground">
          {remaining >= 0 ? `${remaining.toFixed(1)} hrs remaining` : `${Math.abs(remaining).toFixed(1)} hrs over limit`}
        </div>
      </div>
    );
  }

  // On-Demand - show hours logged this month
  if (contractType === "on_demand") {
    const hoursThisMonth = contract.period_hours_used || 0;
    const totalLogged = contract.hours_used || 0;

    if (compact) {
      return (
        <span className="text-sm text-muted-foreground">
          {hoursThisMonth.toFixed(1)} hrs this month
        </span>
      );
    }

    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>This Month</span>
          <span className="font-medium">{hoursThisMonth.toFixed(1)} hrs</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {totalLogged.toFixed(1)} hrs total logged
        </div>
      </div>
    );
  }

  // Fixed Cost / Service - show status only
  if (contractType === "fixed_cost" || contractType === "service") {
    return (
      <span className="text-sm text-muted-foreground">Fixed rate</span>
    );
  }

  // Default fallback
  return <span className="text-sm text-muted-foreground">—</span>;
}
