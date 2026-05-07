import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { CardGrid } from "@/components/ui/card-grid";
import { PriorityCard } from "@/components/priorities/priority-card";
import { getPriorities } from "@/app/actions/priorities";
import { getReferenceValues } from "@/app/actions/reference";
import { PrioritiesFilter } from "@/components/priorities/priorities-filter";
import type { Customer, PriorityWithRelations, ReferenceValue } from "@/types/database";

interface PrioritiesPageProps {
  searchParams: Promise<{
    customerId?: string;
    statusId?: string;
    priorityLevelId?: string;
    openOnly?: string;
  }>;
}

const OPEN_PRIORITY_VALUES = ["backlog", "next_up", "active"] as const;

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .order("name");
  return (data || []) as Customer[];
}

async function getCurrentUserRole(): Promise<{ role: string; customerId: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { role: "customer_user", customerId: null };
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, customer_id")
    .eq("id", user.id)
    .single();
  
  return {
    role: profile?.role || "customer_user",
    customerId: profile?.customer_id || null,
  };
}


export default async function PrioritiesPage({ searchParams }: PrioritiesPageProps) {
  const params = await searchParams;
  const { customerId, statusId, priorityLevelId } = params;
  const openOnly = params.openOnly === "true";
  const { role, customerId: userCustomerId } = await getCurrentUserRole();
  const isInternal = role === "admin" || role === "staff";

  // For customer users, always filter by their customer
  const effectiveCustomerId = isInternal ? customerId : userCustomerId || undefined;

  const [statuses, priorityLevels, customers] = await Promise.all([
    getReferenceValues("priority_status"),
    getReferenceValues("priority_level"),
    isInternal ? getCustomers() : Promise.resolve([]),
  ]);

  const openStatusIds =
    openOnly && !statusId
      ? statuses
          .filter((s) => (OPEN_PRIORITY_VALUES as readonly string[]).includes(s.value))
          .map((s) => s.id)
      : undefined;

  const { data: priorities } = await getPriorities({
    customerId: effectiveCustomerId,
    statusId,
    statusIds: openStatusIds,
    priorityLevelId,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Priorities</h1>
          <p className="text-muted-foreground">
            {isInternal ? "Manage customer priorities" : "View your priorities"}
          </p>
        </div>
        {isInternal && (
          <Link href="/priorities/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Priority
            </Button>
          </Link>
        )}
      </div>

      <PrioritiesFilter
        customers={customers}
        statuses={statuses}
        priorityLevels={priorityLevels}
        currentCustomerId={customerId}
        currentStatusId={statusId}
        currentPriorityLevelId={priorityLevelId}
        isInternal={isInternal}
      />

      {priorities.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No priorities found"
          description={isInternal ? "Create priorities to track customer goals" : "No priorities have been set for your account"}
          action={isInternal ? { label: "New Priority", href: "/priorities/new" } : undefined}
        />
      ) : statusId ? (
        // Flat list when a status filter is applied; grouping would be a single
        // section anyway and visual headings just add noise.
        <CardGrid>
          {priorities.map((priority) => (
            <PriorityCard
              key={priority.id}
              id={priority.id}
              title={priority.title}
              icon={priority.icon}
              status={priority.status?.value || ""}
              statusLabel={priority.status?.label || "Unknown"}
              priorityLevel={priority.priority_level?.value || ""}
              priorityLevelLabel={priority.priority_level?.label || "Normal"}
              customerName={isInternal ? priority.customer?.name : undefined}
            />
          ))}
        </CardGrid>
      ) : (
        <PriorityGroups
          priorities={priorities}
          statuses={statuses}
          isInternal={isInternal}
        />
      )}
    </div>
  );
}

const STATUS_DISPLAY_ORDER = ["active", "next_up", "backlog", "complete"] as const;

interface PriorityGroupsProps {
  priorities: PriorityWithRelations[];
  statuses: ReferenceValue[];
  isInternal: boolean;
}

function PriorityGroups({ priorities, statuses, isInternal }: PriorityGroupsProps) {
  const labelByValue = new Map(statuses.map((s) => [s.value, s.label]));

  // Bucket by status value, then render in the configured display order so
  // Active surfaces first regardless of how the data is ordered.
  const buckets = new Map<string, typeof priorities>();
  for (const p of priorities) {
    const value = p.status?.value || "unknown";
    const list = buckets.get(value) ?? [];
    list.push(p);
    buckets.set(value, list);
  }

  const orderedKeys = [
    ...STATUS_DISPLAY_ORDER.filter((v) => buckets.has(v)),
    ...Array.from(buckets.keys()).filter(
      (v) => !STATUS_DISPLAY_ORDER.includes(v as (typeof STATUS_DISPLAY_ORDER)[number])
    ),
  ];

  return (
    <div className="space-y-8">
      {orderedKeys.map((statusValue) => {
        const group = buckets.get(statusValue) ?? [];
        if (group.length === 0) return null;
        const heading = labelByValue.get(statusValue) || statusValue;
        return (
          <section key={statusValue} aria-labelledby={`status-${statusValue}`} className="space-y-3">
            <div className="flex items-baseline gap-3">
              <h2
                id={`status-${statusValue}`}
                className="text-lg font-semibold text-foreground"
              >
                {heading}
              </h2>
              <span className="text-sm text-muted-foreground">{group.length}</span>
            </div>
            <CardGrid>
              {group.map((priority) => (
                <PriorityCard
                  key={priority.id}
                  id={priority.id}
                  title={priority.title}
                  icon={priority.icon}
                  status={priority.status?.value || ""}
                  statusLabel={priority.status?.label || "Unknown"}
                  priorityLevel={priority.priority_level?.value || ""}
                  priorityLevelLabel={priority.priority_level?.label || "Normal"}
                  customerName={isInternal ? priority.customer?.name : undefined}
                />
              ))}
            </CardGrid>
          </section>
        );
      })}
    </div>
  );
}
