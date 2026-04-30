"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

/**
 * Tiny wrapper around recharts' `ResponsiveContainer` that gives every
 * chart in the portal a consistent height + theme-aware default styling.
 *
 * Charts read their colors from the brand-token CSS variables emitted by
 * `lib/theme/css-vars.ts` (e.g. `var(--brand-accent)`), so an admin
 * re-skinning the portal at `/settings/portal-branding` automatically
 * re-skins the charts with no code change.
 *
 * Tooltip styles are wired via the `--chart-tooltip-*` custom properties
 * on this container so individual charts can render a `<Tooltip>` and
 * pick up the same surface treatment without re-declaring colors.
 */
export interface ChartContainerProps {
  children: React.ReactElement;
  /** Optional aspect ratio override; defaults to a 16:6 banner aspect. */
  height?: number | string;
  className?: string;
  /** Accessible label for screen readers. */
  ariaLabel: string;
}

export function ChartContainer({
  children,
  height = 280,
  className,
  ariaLabel,
}: ChartContainerProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "w-full",
        // Expose tooltip / axis surface tokens so child charts can
        // reference them without each importing utils.
        "[--chart-grid:var(--brand-border)]",
        "[--chart-axis:var(--brand-fg-muted)]",
        "[--chart-tooltip-bg:var(--brand-surface)]",
        "[--chart-tooltip-fg:var(--brand-fg)]",
        "[--chart-tooltip-border:var(--brand-border)]",
        className
      )}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Style props ready to splat onto a recharts `<Tooltip>` so every tooltip
 * in the portal looks the same:
 *
 *   <Tooltip {...chartTooltipStyle} />
 */
export const chartTooltipStyle = {
  cursor: { fill: "var(--brand-surface-2)" },
  contentStyle: {
    background: "var(--chart-tooltip-bg)",
    border: "1px solid var(--chart-tooltip-border)",
    borderRadius: "var(--radius)",
    color: "var(--chart-tooltip-fg)",
    fontSize: "0.8125rem",
    boxShadow: "var(--shadow-soft)",
  },
  labelStyle: {
    color: "var(--chart-tooltip-fg)",
    fontWeight: 600,
  },
  itemStyle: {
    color: "var(--chart-tooltip-fg)",
  },
} as const;

/**
 * Common axis tick style — small muted labels using the brand fg-muted.
 */
export const chartAxisTickStyle = {
  fill: "var(--chart-axis)",
  fontSize: 12,
  fontVariantNumeric: "tabular-nums",
} as const;
