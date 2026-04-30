"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import type { HoursBucket, BillableMode } from "@/app/actions/dashboard-charts";

/**
 * Filter bar that sits above the customer dashboard's time chart. Three
 * controls — bucket toggle (Daily / Weekly), contract multi-select,
 * billable-mode toggle — all wired into the URL search params via
 * `router.replace()` (shallow). Server components downstream re-fetch on
 * navigation; we don't keep duplicate state on the client.
 */

export interface ContractOption {
  id: string;
  name: string;
}

export interface DashboardFilterBarProps {
  bucket: HoursBucket;
  billableMode: BillableMode;
  selectedContractIds: string[];
  contracts: ContractOption[];
}

export function DashboardFilterBar({
  bucket,
  billableMode,
  selectedContractIds,
  contracts,
}: DashboardFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function updateParams(patch: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  const contractOptions = contracts.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        pending && "opacity-70 pointer-events-none"
      )}
      aria-busy={pending}
    >
      <SegmentedToggle
        ariaLabel="Bucket size"
        value={bucket}
        options={[
          { value: "day", label: "Daily" },
          { value: "week", label: "Weekly" },
        ]}
        onChange={(value) => updateParams({ bucket: value })}
      />

      <MultiSelect
        className="min-w-[14rem]"
        options={contractOptions}
        selected={selectedContractIds}
        onChange={(ids) =>
          updateParams({
            contracts: ids.length > 0 ? ids.join(",") : undefined,
          })
        }
        placeholder="All contracts"
      />

      <SegmentedToggle
        ariaLabel="Billable mode"
        value={billableMode}
        options={[
          { value: "all", label: "All" },
          { value: "billable", label: "Billable" },
          { value: "non_billable", label: "Non-billable" },
        ]}
        onChange={(value) => updateParams({ billable: value })}
      />
    </div>
  );
}

/**
 * Tiny segmented toggle. Visually a pill-shaped row of buttons with the
 * active option filled by `--brand-surface-2`. Built inline rather than
 * leaning on a separate ToggleGroup primitive to keep the dependency
 * surface small.
 */
interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedToggleProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
}

function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: SegmentedToggleProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-[var(--radius)] border border-border bg-card p-0.5 text-sm"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-3 rounded-[calc(var(--radius)-2px)] font-medium",
              active
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
