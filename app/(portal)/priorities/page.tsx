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
import type { Customer, ReferenceValue } from "@/types/database";

interface PrioritiesPageProps {
  searchParams: Promise<{
    customerId?: string;
    statusId?: string;
    priorityLevelId?: string;
  }>;
}

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
  const { role, customerId: userCustomerId } = await getCurrentUserRole();
  const isInternal = role === "admin" || role === "staff";

  // For customer users, always filter by their customer
  const effectiveCustomerId = isInternal ? customerId : userCustomerId || undefined;

  const [{ data: priorities }, customers, statuses, priorityLevels] = await Promise.all([
    getPriorities({ customerId: effectiveCustomerId, statusId, priorityLevelId }),
    isInternal ? getCustomers() : Promise.resolve([]),
    getReferenceValues("priority_status"),
    getReferenceValues("priority_level"),
  ]);

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
      ) : (
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
      )}
    </div>
  );
}
