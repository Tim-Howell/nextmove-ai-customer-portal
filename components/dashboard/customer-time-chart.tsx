"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  chartAxisTickStyle,
  chartTooltipStyle,
} from "@/components/charts/recharts-base";
import { EmptyState } from "@/components/ui/empty-state";
import { Clock } from "lucide-react";
import type { HoursSeriesPoint, HoursBucket } from "@/app/actions/dashboard-charts";

interface CustomerTimeChartProps {
  data: HoursSeriesPoint[];
  bucket: HoursBucket;
}

/**
 * Stacked bar chart of billable / non-billable hours over time.
 *
 * Receives pre-aggregated, gap-filled points from `getCustomerHoursSeries`
 * — no client-side reduction. Colors come from theme tokens so an admin
 * re-skinning the portal automatically re-skins the chart.
 *
 * If every point is zero, renders an `EmptyState` instead of a flat chart
 * (which would otherwise look like a bug).
 */
export function CustomerTimeChart({ data, bucket }: CustomerTimeChartProps) {
  const totalHours = data.reduce(
    (sum, p) => sum + p.billableHours + p.nonBillableHours,
    0
  );

  if (totalHours === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No time logged in this range"
        description="Adjust the filters above or check back once your team has logged hours."
      />
    );
  }

  return (
    <ChartContainer ariaLabel="Hours over time" height={280}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--chart-grid)"
          vertical={false}
        />
        <XAxis
          dataKey="bucketStart"
          tick={chartAxisTickStyle}
          tickLine={{ stroke: "var(--chart-grid)" }}
          axisLine={{ stroke: "var(--chart-grid)" }}
          tickFormatter={(iso: string) => formatBucketLabel(iso, bucket)}
          minTickGap={bucket === "day" ? 24 : 12}
        />
        <YAxis
          tick={chartAxisTickStyle}
          tickLine={{ stroke: "var(--chart-grid)" }}
          axisLine={{ stroke: "var(--chart-grid)" }}
          width={36}
          allowDecimals={false}
          label={{
            value: "Hours",
            angle: -90,
            position: "insideLeft",
            offset: 12,
            style: { fill: "var(--chart-axis)", fontSize: 12 },
          }}
        />
        <Tooltip
          {...chartTooltipStyle}
          formatter={(value, name) => [
            `${Number(value).toFixed(1)} hrs`,
            name === "billableHours" ? "Billable" : "Non-billable",
          ]}
          labelFormatter={(label) =>
            formatTooltipLabel(String(label), bucket)
          }
        />
        <Legend
          formatter={(name) =>
            name === "billableHours" ? "Billable" : "Non-billable"
          }
          wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
        />
        <Bar
          dataKey="billableHours"
          stackId="hours"
          fill="hsl(var(--brand-accent-hsl))"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="nonBillableHours"
          stackId="hours"
          fill="var(--brand-fg-muted)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}

function formatBucketLabel(iso: string, bucket: HoursBucket): string {
  const d = new Date(iso);
  if (bucket === "day") {
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  // Weekly: show the week-of label.
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatTooltipLabel(iso: string, bucket: HoursBucket): string {
  const d = new Date(iso);
  if (bucket === "day") {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  return `Week of ${d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}
