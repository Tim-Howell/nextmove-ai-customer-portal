import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardSkeletonProps {
  showHeader?: boolean;
  showContent?: boolean;
  contentLines?: number;
}

export function CardSkeleton({ 
  showHeader = true, 
  showContent = true,
  contentLines = 3 
}: CardSkeletonProps) {
  return (
    <Card aria-busy="true" aria-label="Loading card">
      {showHeader && (
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
      )}
      {showContent && (
        <CardContent className="space-y-2">
          {Array.from({ length: contentLines }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={`h-4 ${i === contentLines - 1 ? 'w-3/4' : 'w-full'}`} 
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
}

interface DashboardCardSkeletonProps {
  variant?: "stat" | "chart" | "list";
}

export function DashboardCardSkeleton({ variant = "stat" }: DashboardCardSkeletonProps) {
  if (variant === "stat") {
    return (
      <Card aria-busy="true" aria-label="Loading statistic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (variant === "chart") {
    return (
      <Card aria-busy="true" aria-label="Loading chart">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card aria-busy="true" aria-label="Loading list">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
