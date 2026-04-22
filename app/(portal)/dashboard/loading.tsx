import { DashboardCardSkeleton } from "@/components/ui/card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-8 w-32" />
      
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
