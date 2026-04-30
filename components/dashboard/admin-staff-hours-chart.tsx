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
import type { StaffHoursPoint } from "@/app/actions/dashboard-charts";

interface AdminStaffHoursChartProps {
  data: StaffHoursPoint[];
}

/**
 * Stacked bar chart of hours-by-staff over the trailing 90 days. One bar
 * per staff member, billable vs. non-billable stacked. No filters by
 * design — richer staff analytics live in `/reports`.
 */
export function AdminStaffHoursChart({ data }: AdminStaffHoursChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No time logged in the last 90 days"
        description="Once your team starts logging time entries, you'll see a per-person breakdown here."
      />
    );
  }

  // Dynamic chart height: each staff bar gets ~36px so a busy team
  // doesn't squash. Capped at 480px to avoid runaway scroll on a 50-person
  // org.
  const height = Math.min(480, Math.max(220, data.length * 36 + 80));

  return (
    <ChartContainer ariaLabel="Hours by staff person, last 90 days" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        barCategoryGap="25%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--chart-grid)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={chartAxisTickStyle}
          tickLine={{ stroke: "var(--chart-grid)" }}
          axisLine={{ stroke: "var(--chart-grid)" }}
          allowDecimals={false}
        />
        <YAxis
          dataKey="staffName"
          type="category"
          tick={chartAxisTickStyle}
          tickLine={{ stroke: "var(--chart-grid)" }}
          axisLine={{ stroke: "var(--chart-grid)" }}
          width={140}
        />
        <Tooltip
          {...chartTooltipStyle}
          formatter={(value, name) => [
            `${Number(value).toFixed(1)} hrs`,
            name === "billableHours" ? "Billable" : "Non-billable",
          ]}
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
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
