import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ContractBurndown } from "@/app/actions/dashboard-charts";

interface CustomerBurndownCardProps {
  burndown: ContractBurndown;
}

/**
 * Single-contract burndown summary: contract name, fill bar, big "X / Y
 * hours" numeric, remaining-hours subtext, and a period label. Over-budget
 * contracts get a destructive-tinted bar.
 *
 * Server component — no interactivity needed.
 */
export function CustomerBurndownCard({ burndown }: CustomerBurndownCardProps) {
  const {
    contractId,
    contractName,
    contractTypeLabel,
    usedHours,
    allotmentHours,
    remainingHours,
    periodStart,
    periodEnd,
    isOverBudget,
    rolloverHours,
  } = burndown;

  // Cap the visible fill at 100% so an over-budget contract still renders
  // a sensible bar — we communicate the overage via the numeric and the
  // destructive color treatment, not by overflowing the bar.
  const pct =
    allotmentHours > 0
      ? Math.min(100, (usedHours / allotmentHours) * 100)
      : 0;

  return (
    <Link href={`/contracts/${contractId}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-[var(--shadow-soft)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold leading-tight">
            {contractName}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{contractTypeLabel}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline justify-between">
            <p className="font-display tabular-nums text-3xl">
              {usedHours.toFixed(1)}
              <span className="text-muted-foreground text-base font-normal">
                {" / "}
                {allotmentHours.toFixed(1)} hrs
              </span>
            </p>
          </div>

          <div
            className="h-2 w-full rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${usedHours.toFixed(1)} of ${allotmentHours.toFixed(
              1
            )} hours used`}
          >
            <div
              className={cn(
                "h-full transition-all",
                isOverBudget ? "bg-destructive" : "bg-primary"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>

          <p
            className={cn(
              "text-sm tabular-nums",
              isOverBudget
                ? "text-destructive font-medium"
                : "text-muted-foreground"
            )}
          >
            {isOverBudget
              ? `${Math.abs(remainingHours).toFixed(1)} hrs over`
              : `${remainingHours.toFixed(1)} hrs remaining`}
            {rolloverHours > 0 && !isOverBudget && (
              <span className="text-muted-foreground">
                {" "}
                · incl. {rolloverHours.toFixed(1)} rollover
              </span>
            )}
          </p>

          <p className="text-xs text-muted-foreground">
            {formatPeriodRange(periodStart, periodEnd)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function formatPeriodRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const fmt: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return `${start.toLocaleDateString(undefined, fmt)} – ${end.toLocaleDateString(
    undefined,
    fmt
  )}`;
}
