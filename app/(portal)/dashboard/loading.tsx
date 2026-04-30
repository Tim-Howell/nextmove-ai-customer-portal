import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DashboardCardSkeleton } from "@/components/ui/card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard loading skeleton.
 *
 * The composition matches both role variants closely enough that a single
 * skeleton works: a chart-shaped block at the top, then a row of summary
 * tiles, then two list/burndown blocks. We don't read the role here (it
 * would require an async boundary that defeats the purpose of a skeleton).
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-9 w-48" />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCardSkeleton variant="stat" />
        <DashboardCardSkeleton variant="stat" />
        <DashboardCardSkeleton variant="stat" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCardSkeleton variant="stat" />
        <DashboardCardSkeleton variant="stat" />
        <DashboardCardSkeleton variant="stat" />
        <DashboardCardSkeleton variant="stat" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCardSkeleton variant="list" />
        <DashboardCardSkeleton variant="list" />
      </div>
    </div>
  );
}
