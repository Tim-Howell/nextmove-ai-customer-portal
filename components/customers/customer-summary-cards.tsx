import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomerSummaryCardsProps {
  customerId: string;
}

interface SummaryCardProps {
  count: number;
  label: string;
  numberHref: string;
  viewAllHref: string;
  viewAllLabel: string;
}

function SummaryCard({
  count,
  label,
  numberHref,
  viewAllHref,
  viewAllLabel,
}: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-6 text-center">
        <Link
          href={numberHref}
          className="text-5xl font-bold tracking-tight hover:underline"
        >
          {count}
        </Link>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Link href={viewAllHref}>
          <Button size="sm" variant="outline">
            {viewAllLabel}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

async function safeCount(
  promise: PromiseLike<{ count: number | null; error?: unknown }>
): Promise<number> {
  try {
    const res = await promise;
    if ((res as { error?: unknown }).error) {
      console.error("[CustomerSummaryCards] query error:", (res as { error?: unknown }).error);
      return 0;
    }
    return res.count ?? 0;
  } catch (err) {
    console.error("[CustomerSummaryCards] query threw:", err);
    return 0;
  }
}

export async function CustomerSummaryCards({
  customerId,
}: CustomerSummaryCardsProps) {
  const supabase = await createClient();

  // Resolve "open" reference value ids per spec definitions
  const [contractActiveRefRes, priorityOpenRefsRes, requestOpenRefsRes] =
    await Promise.all([
      supabase
        .from("reference_values")
        .select("id")
        .eq("type", "contract_status")
        .eq("value", "active")
        .maybeSingle(),
      supabase
        .from("reference_values")
        .select("id")
        .eq("type", "priority_status")
        .in("value", ["backlog", "next_up", "active"]),
      supabase
        .from("reference_values")
        .select("id")
        .eq("type", "request_status")
        .in("value", ["new", "in_review", "in_progress"]),
    ]);

  const contractActiveId = contractActiveRefRes.data?.id as string | undefined;
  const priorityOpenIds = (priorityOpenRefsRes.data ?? []).map(
    (r) => r.id as string
  );
  const requestOpenIds = (requestOpenRefsRes.data ?? []).map(
    (r) => r.id as string
  );

  if (contractActiveRefRes.error) {
    console.error(
      "[CustomerSummaryCards] failed to resolve contract active id:",
      contractActiveRefRes.error
    );
  }

  // Run three count queries in parallel; never throw out of the component.
  const [contractsCount, prioritiesCount, requestsCount] = await Promise.all([
    contractActiveId
      ? safeCount(
          supabase
            .from("contracts")
            .select("id", { count: "exact", head: true })
            .eq("customer_id", customerId)
            .eq("status_id", contractActiveId)
            .is("archived_at", null)
        )
      : Promise.resolve(0),
    priorityOpenIds.length > 0
      ? safeCount(
          supabase
            .from("priorities")
            .select("id", { count: "exact", head: true })
            .eq("customer_id", customerId)
            .in("status_id", priorityOpenIds)
            .eq("is_read_only", false)
        )
      : Promise.resolve(0),
    requestOpenIds.length > 0
      ? safeCount(
          supabase
            .from("requests")
            .select("id", { count: "exact", head: true })
            .eq("customer_id", customerId)
            .in("status_id", requestOpenIds)
            .eq("is_read_only", false)
        )
      : Promise.resolve(0),
  ]);

  // Build URLs that match the actual list-page filter params.
  const contractsActiveHref = contractActiveId
    ? `/contracts?customerId=${customerId}&statusId=${contractActiveId}`
    : `/contracts?customerId=${customerId}`;
  // "View All" for contracts must include archived (separate toggle on the list page).
  const contractsAllHref = `/contracts?customerId=${customerId}&showArchived=true`;
  // Number link drills into "open only"; "View All" drops the open filter.
  const prioritiesOpenHref = `/priorities?customerId=${customerId}&openOnly=true`;
  const prioritiesAllHref = `/priorities?customerId=${customerId}`;
  const requestsOpenHref = `/requests?customerId=${customerId}&openOnly=true`;
  const requestsAllHref = `/requests?customerId=${customerId}`;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        count={contractsCount}
        label="Active Contracts"
        numberHref={contractsActiveHref}
        viewAllHref={contractsAllHref}
        viewAllLabel="View All Contracts"
      />
      <SummaryCard
        count={prioritiesCount}
        label="Open Priorities"
        numberHref={prioritiesOpenHref}
        viewAllHref={prioritiesAllHref}
        viewAllLabel="View All Priorities"
      />
      <SummaryCard
        count={requestsCount}
        label="Open Requests"
        numberHref={requestsOpenHref}
        viewAllHref={requestsAllHref}
        viewAllLabel="View All Requests"
      />
    </div>
  );
}
