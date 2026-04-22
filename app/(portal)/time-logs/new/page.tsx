import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { TimeEntryForm } from "@/components/time-logs/time-entry-form";
import { getReferenceValues } from "@/app/actions/reference";
import type { Customer } from "@/types/database";
import type { ContractWithHoursInfo } from "@/components/time-logs/contract-hours-context";

interface NewTimeEntryPageProps {
  searchParams: Promise<{
    customerId?: string;
    contractId?: string;
  }>;
}

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .neq("status", "archived")
    .is("archived_at", null)
    .order("name");
  return (data || []) as Customer[];
}

async function getContracts(): Promise<ContractWithHoursInfo[]> {
  const supabase = await createClient();
  
  // Get archived status ID to filter it out
  const { data: archivedStatus } = await supabase
    .from("reference_values")
    .select("id")
    .eq("type", "contract_status")
    .eq("value", "archived")
    .single();

  let query = supabase
    .from("contracts")
    .select(`
      id, 
      name, 
      customer_id, 
      is_default,
      total_hours,
      hours_per_period,
      billing_day,
      start_date,
      end_date,
      rollover_enabled,
      rollover_expiration_days,
      max_rollover_hours,
      contract_type:contract_types(value)
    `)
    .order("name");

  if (archivedStatus) {
    query = query.neq("status_id", archivedStatus.id);
  }
  
  // Also filter out contracts with archived_at set
  query = query.is("archived_at", null);

  const { data: contracts } = await query;
  if (!contracts) return [];

  // Fetch time entries for each contract to calculate hours
  const contractsWithEntries = await Promise.all(
    contracts.map(async (contract: any) => {
      const { data: entries } = await supabase
        .from("time_entries")
        .select("hours, entry_date")
        .eq("contract_id", contract.id);

      return {
        id: contract.id,
        name: contract.name,
        customer_id: contract.customer_id,
        is_default: contract.is_default,
        contract_type_value: contract.contract_type?.value,
        total_hours: contract.total_hours,
        hours_per_period: contract.hours_per_period,
        billing_day: contract.billing_day,
        start_date: contract.start_date,
        end_date: contract.end_date,
        rollover_enabled: contract.rollover_enabled,
        rollover_expiration_days: contract.rollover_expiration_days,
        max_rollover_hours: contract.max_rollover_hours,
        time_entries: (entries || []).map((e: any) => ({
          hours: Number(e.hours),
          entry_date: e.entry_date,
        })),
      };
    })
  );

  return contractsWithEntries;
}

async function getStaff(): Promise<{ id: string; full_name: string }[]> {
  const supabase = await createClient();
  const profile = await getProfile();
  
  if (profile?.role !== "admin" && profile?.role !== "staff") {
    return [];
  }
  
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("role", ["admin", "staff"])
    .eq("is_active", true)
    .order("full_name");
  return data || [];
}

export default async function NewTimeEntryPage({ searchParams }: NewTimeEntryPageProps) {
  const params = await searchParams;
  
  const profile = await getProfile();
  const isInternal = profile?.role === "admin" || profile?.role === "staff";
  
  const [customers, contracts, categories, staff] = await Promise.all([
    getCustomers(),
    getContracts(),
    getReferenceValues("time_category"),
    getStaff(),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <TimeEntryForm
        customers={customers}
        contracts={contracts}
        categories={categories}
        staff={staff}
        defaultCustomerId={params.customerId}
        defaultContractId={params.contractId}
        isInternal={isInternal}
      />
    </div>
  );
}
